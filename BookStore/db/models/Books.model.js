import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    bookName: { type: String, required: true},
    bookCategory : { type: String, required: true},
    bookAuthor : { type: String, required: true },
    bookImage: {type: String},
    bookDescription : {type:String},
    bookPrice:{type:Number, required:true},
});
const Book = mongoose.model('Book', bookSchema);

export default Book;