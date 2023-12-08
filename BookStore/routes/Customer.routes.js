import express from "express";
import Customer from "../models/Customer.model.js";
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
const app = express.Router();
const jwt = jsonwebtoken;
import { authenticateToken, isAdmin } from "../utils/auth.js";

// const generateSecretKey = () => {
//   return crypto.randomBytes(32).toString('hex'); // 32 bytes for a strong secret
// };
// const secretKey = generateSecretKey();


app.get("/", (req, res) => {
    res.status(200).send("Hello Customers");
});

app.post("/register", async(req, res) => {
    try {
        const {firstName, lastName, emailId, password, role} = req.body;
        console.log("Check body revceived", req.body);
       
    if (!(emailId && password && firstName && lastName)) {
        res.status(400).send("All inputs are required");
      }
   
      // --- if user exists --- throw error that user already exists
      if (await Customer.findOne({emailId:emailId})) {
    //    console.log("CHECK IF CUSTOMER EXIST" , await Customer.find({emailId}));
        return res.status(409).send({message: "User Already Exist, Please Login or Register with different credentials"});
      }

      // else create the customer account
      const encryptedPassword = await bcrypt.hash(password, 10);
     
      // create method would craete a new object of Customer and call save() method to save collection into the database
      const customer = await Customer.create({
          firstName,
          lastName,
          emailId: emailId.toLowerCase(), 
          password: encryptedPassword,
          role:role,
          
        });
          // Create token
        const token = jwt.sign(
            {
                customerId: customer._id,
                emailId: customer.emailId,
                role:customer.role

            },
           process.env.SECRET_KEY,
            {
            expiresIn: "1h",
            }
        );
        customer.token = token;
        console.log("CHECKCK cstomer", customer);
        
        res.status(201).send({
          message:"User created Successfully" , 
          customer:customer
        });
     } catch (err) {
       console.error(err);
       res.status(403).send({
        message:"Error in registering new User \n Please try Again after some time" , 
      });
    }
});




// ---------- Login -----

app.post("/login", async (req, res) => {
    try {
      // Extract user input
      const { emailId, password } = req.body;
        console.log("In login checking credentials", req.body);
      
        // Validate user input
      if (!(emailId && password)) {
        res.status(400).send({message : "All inputs are required"});
      }
      // Validate if user exist in our database
      const user = await Customer.findOne({ emailId });
        
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        console.log("Im checking login", user);
        
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
  
        // send back the customer object with token...
        res.status(200).json({message:"LogIn Successfully", customer : user});
      }
      else {
      res.status(400).send({message:"Invalid Credentials!! Please try again with authorized credentials"});
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({message:"Internal Server Error! \n Please try again after some time"});
    }

  });
  

// ------ functionality for the user to edit his profile

app.put("/update-profile/:id",authenticateToken, async(req, res) => {
  
  // --- user should be able to update his firstName, lastName, and password
  // --- CAN"T UPDATE EMAIL ID

  const { firstName, lastName, password } = req.body;
  const userId = req.params.id;

  try {
  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id:userId },
    { $set: {firstName, lastName, password }},
    { new:true }
    );
    console.log("CHECK UPDATED RECORD", updatedCustomer);
  
  if (!updatedCustomer) {
    res.status(404).send({message: `User with User Id ${id} Not found`});
  }

  res.status(200).send(`User with email Id ${updatedCustomer.emailId} updated Successfully`);

}
catch(error) {
console.error("ERRR", error);
  res.status(500).send({message:"Internal Server Error!!! Please try again later"});
}
});

app.post("/add-toCart", authenticateToken, async(req, res)=>{
  try {
    const { customerId, bookId, quantity } = req.body;

    // Find the already customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
        return res.status(404).send({ message: 'Customer not found' });
    }

    // Calling addToCart method to update the cart
    const result = await customer.addToCart(bookId, quantity);

    if (result) {
        res.status(200).send({ message: 'Item added to cart successfully' });
    } else {
        res.status(500).send({ message: 'Error adding item to cart' });
    }
} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
}
});


// --------- FETCH THE CART_ITEMS FOR THE CUSTOMER
app.get('/fetchCartItems/:customerId', async (req, res) => {
  try {
      const customerId = req.params.customerId;

      // Finding the customer by BY THE BOOK ID
      const customer = await Customer.findById(customerId).populate('cart.bookId');

      if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
      }

      const cartItems = customer.cart.map(item => ({
          bookId: item.bookId._id,
          bookName: item.bookId.bookName, 
          quantity: item.quantity,
      }));

      res.status(200).send({ message: 'Cart Items retreived successfully', cartItems });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});


export default app;

