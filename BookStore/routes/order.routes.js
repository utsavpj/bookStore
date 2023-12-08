import mongoose from "mongoose";
import Order from "../models/Orders.model.js";
import Customer from "../models/Customer.model.js";
import express from "express";
import stripeLib from 'stripe';
import { authenticateToken } from "../utils/auth.js";
import Book from "../models/Books.model.js";
import Inventory from "../models/Inventory.model.js";
const stripe = stripeLib('sk_test_51Nsr57IKWKaCzW6hlGDg0GHN7F3kktuIdlbJrI0wmbZCHbsxIDMSlJ1FtiRVWCBo2B8FaK72hD0WmIl5ODr5pIeK00rIrdekY6');

const app = express.Router();

//  ------ USER can CRUD
// create a order , Get all orders, 
// C - Create a new order  /orders/placeOrder/id
// R - Read/Get all orders by the customer   /orders/customer/id
// U - Update/Modify an existing order
// D - Delete/Cancel an existing order



app.get("/customer/:id", authenticateToken, async(req, res) => {
    try {
        const customerId = req.params.id;
        console.log("--to fetch orders using Customer id", customerId);

        // now we have to find the customer.. with same id
        const customer = await Customer.findOne({_id:customerId});
        if(!customer) {
            res.status(404).send({message: `Customer with id ${customerId} doesn't exist please log in with correct crendentials `});
        }
        const allOrders = await Order.find({customerId:customerId})
        .populate({
            path:"books.book"
        }).exec();
        console.log("all orders.. for existing customer " + customerId + allOrders);
        
        res.status(200).send({message:'Orders retrieved successfully', 
        orders: allOrders
    });

    } catch(error) {
        res.status(500).send({message: "Oops!! Something went Wrong"});
  
    }
});

//------- FETCH SPECIFIC ORDER........

app.get("/customer/:orderId/:customerId", authenticateToken, async(req, res)=> {
  try {
    const {orderId, customerId} = req.params;
    console.log("CHECKING.. order id & customerid", orderId, customerId);

    const order = await Order.findById(orderId); 
    if (order) {
      res.status(200).send({message:`Order with orderId ${orderId} retreived successfully`,
      order:order
    })} else {
      res.status(404).send({message:`Order with orderId ${orderId} doesn't exist`});
    }
  } catch(error) {
    console.error(`Error fetching the specific order`, error);
    res.status(500).send({message:"Internal Server Error!!! Please try again later"});
  }
});





const calculateAmount = (books) => {
    console.log("I AM IN CALCULATE PAYMENT", books);
    // [
    //   {
    //     book: {
    //       _id: new ObjectId('656cd0972b7917d93ff2f1ad'),
    //       bookName: 'Tales of the Spider Man',
    //       bookCategory: 'Science Fiction for children & Teenagers',
    //       bookAuthor: 'Aakarshan',
    //       bookImage: '',
    //       bookDescription: 'It is a science fiction movie based on the tales and events of the character named Spiderman having a back story',
    //       bookPrice: 120.99,
    //       __v: 0
    //     },
    //     quantity: 3
    //   },
    //   {
    //     book: {
    //       _id: new ObjectId('656bd721b4176cca0de44744'),
    //       bookName: 'Introduction to java',
    //       bookCategory: 'education',
    //       bookAuthor: 'Ashwin Rajput',
    //       bookImage: '',
    //       bookDescription: 'TESTign the new book',
    //       bookPrice: 43,
    //       __v: 0
    //     },
    //     quantity: 2
    //   }
    // ]
  let totalAmount = 0;
  books.forEach(({book, quantity})=> {
   console.log("CHECK BOOK", book, quantity);
    const {bookPrice} = book;
    console.log("CHECKING PRICE CALC", bookPrice , quantity, (bookPrice * quantity))
    totalAmount += (bookPrice * quantity);
  
  });
  // STripe wants the currency should be in cents ... so rounding of and * 100
  return Math.round(totalAmount * 100);;
}

// only logged in user can craete an order
app.post("/customer/placeOrder/:id", authenticateToken, async (req, res) => {
  console.log(req)
    try {
      const { books, orderOptions, customerIdStripeAccount, payment_method } = req.body;
      const customerId = req.params.id;
      const customer = await Customer.findOne({ _id: customerId });
      console.log(books)
  
      if (!customer) {
        return res.status(404).send({ message: `Customer with id ${customerId} doesn't exist. Please log in with correct credentials.` });
      }
  
    let newOrderAsPerInventory = [];
    let orderNotFulfilling = [];

    for(let book of books) {
      // Use findOne to get a single document
      // console.log("Order REQ placed for book ", book.book, await Inventory.find({book:book.book}));
      const inventoryForOrderedBook = await Inventory.findOne({book:book.bookId});
      console.log("CHECK...THE INVENTORY", inventoryForOrderedBook);
     
      const inventoryBookQuantity = inventoryForOrderedBook.quantity;
      const inventoryBookId = inventoryForOrderedBook.book;
      // console.log("INVENTORY", inventoryBookQuantity, "ORDERED", book.quantity);
  
      
    if(inventoryBookQuantity < book.quantity) {
      
      // console.log("INVENTORY IS LESS THAN BOOK QUANTITY", book.book)   
      // console.log("---- FROM INVENTORY BOOK ---", inventoryBookId[0].toString(),inventoryBookQuantity )
      // console.log("VS ORDERED " +book.book, book.quantity);
      
      // inventoryBookId[0].toString()
      const rejectList = book.quantity - inventoryBookQuantity;
      
      // console.log(`${inventoryBookId[0].toString()} REJECT..., ${rejectList} SEND ${inventoryBookQuantity}`);

      orderNotFulfilling.push({book:inventoryBookId[0].toString(), quantity:rejectList});
      if(inventoryBookQuantity!=0){
      newOrderAsPerInventory.push({book:inventoryBookId[0].toString(), quantity: inventoryBookQuantity })
      }
      console.log("CHECK NOT fulfilled ",orderNotFulfilling, '\n',
      "FULFILLED",newOrderAsPerInventory);
      }
    else {
      console.log("IN THE ELSEEEEEEEE");
      newOrderAsPerInventory = [...books];
    }
      // console.log("NO PROBLEM NORMAL ORDER", newOrderAsPerInventory);
    }
  const order_not_getting_fulfilled = await Promise.all(orderNotFulfilling.map(async (book) => {
    // // console.log("CHECKING BOoK ORDERED", book);    
    const orderDetailNotFulfilled = await Book.findOne({ _id: book.book });
    return {
      message : `Quantity for "${orderDetailNotFulfilled.bookName}" not available`,
      book: orderDetailNotFulfilled,
      quantity: book.quantity,
    };
  })
  );

  console.log("THE ORDER WHICH WE NOT BE FULFILLING", order_not_getting_fulfilled);
      // Create order in the database
      const booksForOrder = await Promise.all(newOrderAsPerInventory.map(async (book) => {
        console.log("CHECKING BOoK ORDERED", book);    
      const bookDetails = await Book.findOne({ _id: book.book });
      // we need to update the inventory whenver we place an order
       // Calculate the order amount
      console.log("CHEKCING ONLY ORDERED BOOKS WITH ENOUGH QT", bookDetails);
      

      await Inventory.findOneAndUpdate(
        {book:bookDetails._id} ,
        {$inc:{bookQuantity:-book.quantity}},
        {upsert:true}
      );

        return {
          book: bookDetails,
          quantity: book.quantity,
        };
      }));

           
      const orderAmount = await calculateAmount(booksForOrder);
      console.log("CHECK .. order amount", orderAmount);
      if (orderAmount == 0) {
       res.status(400).send({
          message: `The Product is unavailable`,
          "OrderRejected" : order_not_getting_fulfilled,
        });
      } else {
        // Create paymentIntent and confirm it
        const paymentIntent = await stripe.paymentIntents.create({
          amount: orderAmount,
          currency: 'usd',
          customer: customerIdStripeAccount,
          confirmation_method: "automatic",
          confirm: true,
          payment_method,
          return_url:'https://localhost:3000'
        });
  
      const newOrder = await Order.create({
        customerId: customerId,
        books: booksForOrder,
        orderOptions: orderOptions,
        paymentIntentId: paymentIntent.id,
        orderStatus: "Processing"
      });

      res.status(201).send({
        message: `New order with Order id ${newOrder._id} created successfully`,
        newOrder,
        "OrderRejected" : order_not_getting_fulfilled,
        confirmedPaymentIntent: paymentIntent,
      });
    }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Oops!! Something went Wrong" });
    }
  });



// ----- // DELETE EXISTING ORDER.... 
app.delete("/customer/deleteOrder/:orderId/:customerId/:orderStatus", authenticateToken, async(req, res) => {
  // -- retreive existing orders.... already processed by the user and already purchased
  try {
    const {orderId, customerId, orderStatus} = req.params;
   console.log("CHECK orderId, customerId, orderStatus", orderId, customerId, orderStatus);
    const allOrdersForCustomer = await Order.find({customerId: customerId});
    // console.log("ALL ORDERS FOR CUSTOMER ID",customerId,allOrdersForCustomer )

    // if order status is either pending or processing 
    // then only user should be able to cancel the order.. else no
    if(orderStatus =="Processing" || orderStatus == "Pending") { 
       const order =  await Order.findOneAndDelete({_id:orderId});
       console.log()
      res.status(200).send({message:`Order with order Id ${order._id} deleted Successfully`, orders:await Order.find()});
      }
      else {
        res.status(403).send({message:`We can't cancel Order with Order Id ${orderId} as it is either shipped/Delivered`});
      }
  }
  catch(error) { 
    console.error("error", error);
    res.status(500).send({message:"Internal Server Error!!! Please try again later"});
  }
});


export default app;

