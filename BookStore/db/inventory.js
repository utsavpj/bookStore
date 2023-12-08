import Inventory from "./models/Inventory.model.js";

// returns inventory for a book with given book id
export async function getInventoryForBookId(bookId) {
  return Inventory.findOne({ bookId: bookId });
}

// add new inventory
export async function addNewBookToInvetory(bookId, quantity) {
  return Inventory.create({
    bookId,
    quantity
  });
}

// updates quantity for a book with given book id
export async function updateQuantity(bookId, quantity) {
  return Inventory.findOneAndUpdate(
    { bookId: bookId },
    { $set: { quantity: quantity } },
    { upsert: true }
  );
}

// decreases quantity for a book with given book id
export async function decreaseQuantity(bookId, quantity) {
  return Inventory.findOneAndUpdate(
    { bookId: bookId },
    { $inc: { quantity: -quantity } },
    { upsert: true }
  );
}
