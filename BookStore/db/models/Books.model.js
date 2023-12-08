import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    // bookId:{type:String, required:true},
    bookName: { type: String, required: true},
    bookCategory : { type: String, required: true},
    bookAuthor : { type: String, required: true },
    bookImage: {type: String},
    bookDescription : {type:String},
    bookPrice:{type:Number, required:true},
    bookQuantity: { type: Number, default: 0 },
   

    // "bookQunatity" : "322",
    // "bookStatus" : 32
    // inventory : {mongoose.Schema.Types.ObjectId}
    // bookStatus : [type:Number, Book Quantity or no of books available } ,from inventory}
    // bookQuantity : {type:Number, required: true} 
    // If purchased succesful then decrease the bookQuantity from inventory, if zero out of stock, set status unavailable
    //

});
const Book = mongoose.model('Book', bookSchema);

export default Book;