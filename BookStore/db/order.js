import Order from "./models/Orders.model.js";

export async function getOrderForCustomer(customerId) {
    return Order.find({ customerId: customerId })
    .populate({
      path: "books.book",
    })
    .exec()
}


export async function getOrderById(id) {
    return Order.findById({ _id: id })
}


export async function deleteOrderById(id) {
  return Order.findOneAndDelete({ _id: id })
}