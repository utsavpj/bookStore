import Customer from "./models/Customer.model.js";
import { encryptPassword } from "../utils/encryptor.js";
import { Error } from "mongoose";

// get customer by email address
export async function getCustomerByEmail(email) {
  return Customer.findOne({ emailId: email });
}

// get customer by id
export async function getCustomerById(id) {
    return Customer.findOne({ _id: id });
  }

// saves new customer
export async function saveCustomer(firstName, lastName, email, password, role) {
  console.log("saveCustomer ", password)
  let encryptedPassword = await encryptPassword(password);
  return Customer.create({
    firstName,
    lastName,
    emailId: email.toLowerCase(),
    password: encryptedPassword,
    role: role,
  });
}

// update customer information
export async function updateCustomer(id, firstName, lastName, password) {
  let encryptedPassword = await encryptPassword(password);

  return Customer.findOneAndUpdate(
    { _id: id },
    { $set: { firstName, lastName, password: encryptedPassword } },
    { new: true }
  );
}

// Update customer's cart
export async function addBookToCustomerCart(customerId, bookId, quantity) {
    let customer = await getCustomerById(customerId);
    if(!customer) {
        throw new Error('Parameter is not a number!');
    }
    return customer.addToCart(bookId, quantity);
}

// get customer's cart
export async function getCustomerCart(customerId) {
    return Customer.findById({_id: customerId}).populate('cart');
}