import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    books: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    orderStatus: {
        type: String,
        enum : ['Pending', 'Processing', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    orderDate: {
        type:Date,
        default:Date.now
    },
    orderOptions: {
        type:String,
        enum : ["Pickup", "Delivery"],
        default: "Delivery"
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
