import Order from "./models/Orders.model.js";

// returns all order for a customer
export async function getOrderForCustomer(customerId) {
  return Order.find({ customerId: customerId })
    .populate({
      path: "books.book",
    })
    .exec();
}

// returns order with given id
export async function getOrderById(id) {
  return Order.findById({ _id: id });
}

// delete order with given id
export async function deleteOrderById(id) {
  return Order.findOneAndDelete({ _id: id });
}

// creates new order
export async function createOrder(
  customerId,
  books,
  orderOptions,
  orderStatus,
  paymentIntentId,
  amount
) {
  return Order.create({
    customerId,
    books,
    orderOptions,
    orderStatus,
    paymentIntentId,
    amount
  });
}
