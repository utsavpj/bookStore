import express from "express";
import {
  addBookToCustomerCart,
  getCustomerCart,
  getCustomerByEmail,
  saveCustomer,
  updateCustomer,
  getCustomerById
} from "../db/customer.js";

import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express.Router();
const jwt = jsonwebtoken;
import { authenticateToken } from "../utils/auth.js";

app.get("/", (req, res) => {
  res.status(200).send("Hello Customers");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, role } = req.body;
    console.log(
      "Check body revceived",
      firstName,
      lastName,
      emailId,
      password,
      role
    );

    if (!(emailId && password && firstName && lastName)) {
      res.status(400).send("All inputs are required");
    }

    // --- if user exists --- throw error that user already exists
    let customer = await getCustomerByEmail(emailId);
    if (customer) {
      return res.status(409).send({ message: "user with email already exist" });
    }

    // create method would craete a new object of Customer and call save() method to save collection into the database
    const newCustomer = await saveCustomer(
      firstName,
      lastName,
      emailId,
      password,
      role
    );
    // Create token
    newCustomer.token = jwt.sign(
      {
        customerId: newCustomer._id,
        emailId: newCustomer.emailId,
        role: newCustomer.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).send({
      message: "User created Successfully",
      customer: newCustomer,
    });
  } catch (err) {
    console.error(err);
    res.status(403).send({
      message: "Error in registering new User",
      error: err,
    });
  }
});

// ---------- Login -----

app.post("/login", async (req, res) => {
  try {
    // Extract user input
    const { emailId, password } = req.body;

    // Validate user input
    if (!(emailId && password)) {
      res.status(400).send({ message: "All inputs are required" });
    }

    const user = await getCustomerByEmail( emailId );
    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
      const token = jwt.sign(
        {
          user_id: user._id,
          emailId,
          role: user.role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      // save user token
      user.token = token;

      res.status(200).json({ message: "LogIn Successfully", customer: user });
    } else {
      res.status(400).send({
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Internal Server Error",
      error: err,
    });
  }
});

app.get('/getUser',async (req, res) => {
  try {
  const token = req.headers.authorization.split(' ')[1];

  // Check if the session token is valid
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  const user = await getCustomerById(decodedToken.user_id);

  console.log("Token and user " + token + user);

  if (user) {
    res.json({
      isLoggedIn: true,
      customer: {
        _id: user._id,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        cart: user.cart,
        token:token, 
      },
    });
  } else {
    res.status(401).json({ isLoggedIn: false, message: 'Invalid session token' });
  }
} catch (error) {
  console.error('Error during session check:', error);
  res.status(401).json({ isLoggedIn: false, message: 'Invalid session token' });
}
});

app.put("/update-profile/:id", authenticateToken, async (req, res) => {
  const { firstName, lastName, password } = req.body;
  const userId = req.params.id;

  try {
    const updatedCustomer = await updateCustomer(
      userId,
      firstName,
      lastName,
      password
    );

    if (!updatedCustomer) {
      res.status(404).send({ message: `User with User Id ${id} Not found` });
    }

    res.status(200).send(`User updated Successfully`);
  } catch (error) {
    console.error("error updating user ", error);
    res.status(500).send({
      message: "Internal Server Error.",
    });
  }
});

app.post("/add-toCart", authenticateToken, async (req, res) => {
  try {
    const { customerId, bookId, quantity } = req.body;

    // Calling addToCart method to update the cart
    const result = await addBookToCustomerCart(customerId, bookId, quantity);

    if (result) {
      res.status(200).send({ message: "Item added to cart successfully" });
    } else {
      res.status(500).send({ message: "Error adding item to cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// --------- FETCH THE CART_ITEMS FOR THE CUSTOMER
app.get("/fetchCartItems/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Finding the customer by BY THE BOOK ID
    const customer = await getCustomerCart(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const cartItems = customer.cart.map((item) => ({
      bookId: item.bookId._id,
      quantity: item.quantity,
    }));

    res
      .status(200)
      .send({ message: "Cart Items retreived successfully", cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
      error: err,
    });
  }
});

export default app;
