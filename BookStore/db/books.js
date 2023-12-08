// layer that interacts with Database
import Book from  "./models/Books.model.js";

//  get all books
export async function getAllBooks() {
  return Book.find();
}

//  get single book by id
export async function getBookById(id) {
  return Book.findOne({ _id: id });
}

// Saves new book document
export async function saveBook(
  bookName,
  bookCategory,
  bookAuthor,
  bookImage,
  bookDescription,
  bookPrice
) {
  return Book.create({
    bookName,
    bookCategory,
    bookAuthor,
    bookImage,
    bookDescription,
    bookPrice
  });
}

// Updates book document with given id
export async function updateBook(
  id,
  bookName,
  bookCategory,
  bookAuthor,
  bookDescription,
  bookPrice
) {
  return Book.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        bookName,
        bookCategory,
        bookAuthor,
        bookDescription,
        bookPrice,
      },
    },
    { new: true }
  );
}

// delete book documents with given id
export async function deleteBook(id) {
    return Book.findOneAndDelete({ _id: id });
  }
  