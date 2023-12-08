import express from "express";

import { authenticateToken } from "../utils/auth.js";
import { clearCustomerCart, getCustomerById } from "../db/customer.js";
import { getBookById } from "../db/books.js";
import {
  createOrder,
  deleteOrderById,
  getOrderById,
  getOrderForCustomer,
} from "../db/order.js";
import { decreaseQuantity, getInventoryForBookId } from "../db/inventory.js";
import { createPaymentIntent } from "../lib/stripe.js";

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
    const customer = await getCustomerById(customerId);
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
    console.error(error);
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
      const inventory = await getInventoryForBookId(book.bookId);

      const totalAvailableQuantity = inventory.quantity;

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
      // Create paymentIntent and confirm it
      const paymentIntent = await createPaymentIntent(orderAmount, "USD");

      let checkoutBooksArr = [];

      for (let obj of checkoutBooks) {
        checkoutBooksArr.push({
          book: obj.book,
          quantity: obj.quantity,
        });

        await decreaseQuantity(obj.book._id, obj.requestBook.quantity);
      }

      const newOrder = await createOrder(
        customerId,
        checkoutBooksArr,
        orderOptions,
        "Processing",
        paymentIntent._id,
        paymentIntent.amount
      );

      // Clear customer cart after successfully processing the order
      await clearCustomerCart(customerId)

      res.status(201).send({
        message: `New order with Order id ${newOrder._id} created successfully`,
        newOrder,
        OrderRejected: failCheckoutBooks,
        paymentClientSecret: paymentIntent.client_secret,
        paymentCurrency: paymentIntent.currency,
        amountInCents: paymentIntent.amount,
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

      let customer = await getCustomerById(customerId);
      if (!customer) {
        return res.status(404).send({
          message: `Customer with id ${customerId} doesn't exist.`,
        });
      }

      let order = await getOrderById(orderId);
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
