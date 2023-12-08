import express from "express";
import { authenticateToken, isAdmin } from "../utils/auth.js";
import Book from  "../models/Books.model.js";
import upload from "../utils/fileUpload.js";
import Inventory from "../models/Inventory.model.js";


const app = express.Router();

//  ------ CRUD FUNCTIONALITY FOR BOOKS -----
// 1) GET ALL BOOKS --- ACCESS TO ALL USERS
// 2) GET/:id ---- GET BOOK BY ID ---- Access to all users
// 3) POST (CREATE A BOOK) ------ ONLY ADMIN
// 4) UPDATE (UPDATE AN EXISTING BOOK INFORMATION) ----- ONLY ADMIN
// 5) DELETE (A BOOK) -- ONLY ADMIN

// 1) GET ALL BOOKS FROM DATABASE
app.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send({message: "Books retreived successfully", books:books});
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error!!! Please try again later" });
    }
});

// 2) GET /:id 
app.get("/:id", async(req, res) => {
    try {
         const id =req.params.id;
        // console.log("Check id", id);
        const book = await Book.findOne({_id:id});
        res.status(200).send({message:"Book Retreived Successfully", books:book});
    } catch(err) {
        res.status(500).send({message:"Internal Server Error!!! Please try again later"});
    }
});

// ------------- ADMIN FEATURES ------------
//  3) CREATE A BOOK 
app.post("/CreateBook", authenticateToken, isAdmin, upload.single("bookImage"), async(req, res) => {
    console.log("Body received:" , req.body)
   try {
    console.log("I AM CREATING BOOK", req.body);
    const {bookName, bookCategory, bookAuthor, bookDescription, bookPrice, bookQuantity } = req.body;
    const bookImage =  req.file ? (req.file.buffer.toString("base64")) : "";
    console.log("bookImage: ", bookImage);
    // const bookImage = req.file.buffer?.toString('base64') || "";
    const newBook = await Book.create({
        bookName,
        bookCategory,
        bookAuthor,
        bookImage,
        bookDescription,
        bookPrice
    });

        await Inventory.create({
            book:newBook._id,
            bookQuantity:bookQuantity
        });

      console.log("CREAATING", newBook);
      res.status(201).json(newBook);

   }
   catch(error) {
    console.log(error);
    res.status(403).json({ error: 'Error creating a new book' });
   }
    
});

// 4) UPDATE (UPDATE AN EXISTING BOOK INFORMATION) ----- ONLY ADMIN
app.put("/updateBook/:id",authenticateToken, isAdmin , async(req, res)=>{
    try {
        const {bookName,bookCategory, bookAuthor, bookDescription, bookPrice, bookQuantity} = req.body;
        const id = req.params.id;
        const book =  await Book.findOneAndUpdate(
            {_id:id},
            {$set: {bookName, bookCategory, bookAuthor, bookDescription, bookPrice}},
            {new:true},
        );
        if (!book) {
            res.status(404).send({ message: `Book with Book Id ${id} not found` });
        }

        // ---- UPDATING THE INVENTORY WHENEVER AND WHATEVER ADMIN WANTS THAT QUANTITY TO BE
        await Inventory.findOneAndUpdate(
            {book: book._id},
            {$set:{bookQuantity}}
            );
        res.status(200).send({message:`Book with Book Id ${id} Updated Successfully`, books:await Book.find()});
    } catch(error) {
        res.status(500).send({message:"Internal Server Error!!! Please try again later"});
    }
})


// 4) DELETE A BOOK
app.delete("/deleteBook/:id", authenticateToken, isAdmin , async(req, res) => {
    try {
        const id =req.params.id;
       console.log("Check id for deletion", id);
        const bookToBeDeleted =  await Book.findOneAndDelete({_id:id});
        console.log("CHECK IF IT EXISTS", bookToBeDeleted);
        if (!bookToBeDeleted) {      
            res.status(404).send({ message: `Book with Book Id ${id} not found` });
        }
        // ------ we will delete the book but for storage purposes we will just update the Quantity to 0
        
        await Inventory.findOneAndUpdate(
            {book: bookToBeDeleted._id},
            {$set:{bookQuantity:0}}
            );

       res.status(200).send({message:`Book with Book Id ${id} deleted Successfully`, books:await Book.find()});
   } catch(err) {
       res.status(500).send({message:"Internal Server Error!!! Please try again later"});
   }
});


export default app;
