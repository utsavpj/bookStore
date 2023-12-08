import express from "express";
import { authenticateToken, isAdmin } from "../utils/auth.js";
import {
  getAllBooks,
  getBookById,
  saveBook,
  updateBook,
  deleteBook,
} from "../db/books.js";
import upload from "../utils/fileUpload.js";

const app = express.Router();

// Get all books
app.get("/", async (req, res) => {
  try {
    const books = await getAllBooks();
    res
      .status(200)
      .send({ message: "Books retreived successfully", books: books });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error!!! Please try again later" });
  }
});

// 2) GET one book by id. Endpoint: /:id
app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await getBookById(id);
    res
      .status(200)
      .send({ message: "Book Retreived Successfully", books: book });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server Error!!! Please try again later" });
  }
});

// ------------- ADMIN FEATURES ------------
//  3) CREATE A BOOK
app.post(
  "/CreateBook",
  authenticateToken,
  isAdmin,
  upload.single("bookImage"),
  async (req, res) => {
    try {
      const {
        bookName,
        bookCategory,
        bookAuthor,
        bookDescription,
        bookPrice,
        bookQuantity,
      } = req.body;
      const bookImage = req.file ? req.file.buffer.toString("base64") : "";
      const newBook = await saveBook(
        bookName,
        bookCategory,
        bookAuthor,
        bookImage,
        bookDescription,
        bookPrice,
        bookQuantity,
      );

      res.status(201).json(newBook);
    } catch (error) {
      console.log(error);
      res.status(403).json({ error: "Error creating a new book" });
    }
  }
);

// 4) UPDATE (UPDATE AN EXISTING BOOK INFORMATION) ----- ONLY ADMIN
app.put("/updateBook/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      bookName,
      bookCategory,
      bookAuthor,
      bookDescription,
      bookPrice,
      bookQuantity,
    } = req.body;
    const id = req.params.id;

    const book = await updateBook(
      id,
      bookName,
      bookCategory,
      bookAuthor,
      bookDescription,
      bookPrice,
      bookQuantity
    );

    if (!book) {
      res.status(404).send({ message: `Book with Book Id ${id} not found` });
    }

    res.status(200).send({
      message: `Book with Book Id ${id} Updated Successfully`,
      book: book ,
    });
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: "Internal Server Error!!! Please try again later" });
  }
});

// 4) DELETE A BOOK
app.delete("/deleteBook/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const bookToBeDeleted = await deleteBook(id);
    if (!bookToBeDeleted) {
      res.status(404).send({ message: `Book with Book Id ${id} not found` });
    }

    res.status(200).send({
      message: `Book with Book Id ${id} deleted Successfully`,
    });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Internal Server Error!!! Please try again later" });
  }
});

export default app;
