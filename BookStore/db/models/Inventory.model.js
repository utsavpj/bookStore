import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, default: 0 },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
