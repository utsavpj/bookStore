import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  book: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Book', 
      required: true 
    }
  ],
  bookQuantity: { type: Number, default: 0 },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
