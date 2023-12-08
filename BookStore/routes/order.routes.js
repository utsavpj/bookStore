import Order from "../db/models/Orders.model.js";

import { deleteOrderById, getOrderById, getOrderForCustomer } from "../db/order.js";

import express from "express";
import stripeLib from "stripe";
import { authenticateToken } from "../utils/auth.js";
import Book from "../db/models/Books.model.js";
import { getCustomerById } from "../db/customer.js";
import { getBookById } from "../db/books.js";

const stripe = stripeLib(
  "sk_test_51Nsr57IKWKaCzW6hlGDg0GHN7F3kktuIdlbJrI0wmbZCHbsxIDMSlJ1FtiRVWCBo2B8FaK72hD0WmIl5ODr5pIeK00rIrdekY6"
);

const app = express.Router();

//  ------ USER can CRUD
// create a order , Get all orders,
// C - Create a new order  /orders/placeOrder/id
// R - Read/Get all orders by the customer   /orders/customer/id
// U - Update/Modify an existing order
// D - Delete/Cancel an existing order

app.get("/customer/:id", authenticateToken, async (req, res) => {
  try {
    const customerId = req.params.id;
    console.log("--to fetch orders using Customer id", customerId);

    // now we have to find the customer.. with same id
    const customer = await getCustomerById( customerId );
    if (!customer) {
      res.status(404).send({
        message: `Customer with id ${customerId} doesn't exist please log in with correct crendentials `,
      });
    }
    const allOrders = await getOrderForCustomer(customerId);
    console.log("all orders.. for existing customer " + customerId + allOrders);

    res
      .status(200)
      .send({ message: "Orders retrieved successfully", orders: allOrders });
  } catch (error) {
    console.error(error)
    res.status(500).send({ message: "Oops!! Something went Wrong" });
  }
});

//------- FETCH SPECIFIC ORDER........

app.get("/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    if (order) {
      res.status(200).send({
        message: `Order with orderId ${orderId} retreived successfully`,
        order: order,
      });
    } else {
      res
        .status(404)
        .send({ message: `Order with orderId ${orderId} doesn't exist` });
    }
  } catch (error) {
    console.error(`Error fetching the specific order`, error);
    res
      .status(500)
      .send({ message: "Internal Server Error!!! Please try again later" });
  }
});

const calculateAmount = (books) => {
  let totalAmount = 0;
  books.forEach(({ book, quantity }) => {
    console.log("CHECK BOOK", book, quantity);
    const { bookPrice } = book;
    console.log(
      "CHECKING PRICE CALC",
      bookPrice,
      quantity,
      bookPrice * quantity
    );
    totalAmount += bookPrice * quantity;
  });
  // STripe wants the currency should be in cents ... so rounding of and * 100
  return Math.round(totalAmount * 100);
};

// only logged in user can craete an order
app.post("/customer/placeOrder/:id", authenticateToken, async (req, res) => {
  try {
    const { books, orderOptions } = req.body;
    const customerId = req.params.id;

    const customer = await getCustomerById(customerId);

    if (!customer) {
      return res.status(404).send({
        message: `Customer with id ${customerId} doesn't exist. Please log in with correct credentials.`,
      });
    }

    let checkoutBooks = [];
    let failCheckoutBooks = [];

    for (let book of books) {
      const dbBook = await getBookById(book.bookId);

      const totalAvailableQuantity = dbBook.bookQuantity;

      if (totalAvailableQuantity >= book.quantity) {
        checkoutBooks.push({
          book: dbBook,
          requestBook: book,
          quantity: book.quantity,
        });
      } else {
        // when we do not have enough quantity
        const extraRequestedQuantity = book.quantity - totalAvailableQuantity;

        failCheckoutBooks.push({
          book: dbBook,
          requestBook: book,
          quantity: extraRequestedQuantity,
        });
      }
    }

    const order_not_getting_fulfilled = Promise.all(
      failCheckoutBooks.map(async (obj) => {
        return {
          message: `Quantity for "${obj.book.bookName}" not available`,
          book: obj.requestBook,
          quantity: obj.quantity,
        };
      })
    );

    const orderAmount = calculateAmount(checkoutBooks);
    if (orderAmount == 0) {
      res.status(400).send({
        message: `The Product is unavailable`,
        OrderRejected: order_not_getting_fulfilled,
      });
    } else {
      const customerIdStripeAccount = "cus_P7H2e7ZgPMw071I";
      const payment_method = "pm_card_visa";

      // Create paymentIntent and confirm it
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: orderAmount,
      //   currency: "USD",
      //   customer: customerIdStripeAccount,
      //   confirmation_method: "automatic",
      //   confirm: true,
      //   payment_method,
      //   return_url: "https://localhost:3000",
      // });

      let checkoutBooksArr = [];

      for (let obj of checkoutBooks) {
        console.log(obj);
        checkoutBooksArr.push({
          book: obj.book,
          quantity: obj.quantity,
        });

        await Book.findOneAndUpdate(
          { _id: obj.book._id },
          { $inc: { bookQuantity: -obj.requestBook.quantity } },
          { upsert: true }
        );
      }

      console.log(checkoutBooksArr);

      const newOrder = await Order.create({
        customerId: customerId,
        books: checkoutBooksArr,
        orderOptions: orderOptions,
        paymentIntentId: "paymentIntent.id",
        orderStatus: "Processing",
      });

      res.status(201).send({
        message: `New order with Order id ${newOrder._id} created successfully`,
        newOrder,
        OrderRejected: failCheckoutBooks,
        confirmedPaymentIntent: "paymentIntent.id",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Oops!! Something went Wrong" });
  }
});

// ----- // DELETE EXISTING ORDER....
app.delete(
  "/customer/deleteOrder/:orderId/:customerId",
  authenticateToken,
  async (req, res) => {
    // -- retreive existing orders.... already processed by the user and already purchased
    try {
      const { orderId, customerId } = req.params;
      console.log(
        "CHECK orderId, customerId",
        orderId,
        customerId
      );

      let customer = await getCustomerById(customerId)
      if (!customer) {
        return res.status(404).send({
          message: `Customer with id ${customerId} doesn't exist.`,
        });
      }

      let order = await getOrderById(orderId)
      if (!order) {
        return res.status(404).send({
          message: `Order with id ${orderId} doesn't exist.`,
        });
      }
      // if order status is either pending or processing
      // then only user should be able to cancel the order.. else no
      if (order.orderStatus == "Processing" || order.orderStatus == "Pending") {
        const order = await deleteOrderById({ _id: orderId });

        res.status(200).send({
          message: `Order with order Id ${order._id} deleted Successfully`,
          orders: await Order.find(),
        });
      } else {
        res.status(403).send({
          message: `We can't cancel Order with Order Id ${orderId} as it is either shipped/Delivered`,
        });
      }
    } catch (error) {
      console.error("error", error);
      res
        .status(500)
        .send({ message: "Internal Server Error!!! Please try again later" });
    }
  }
);

export default app;
