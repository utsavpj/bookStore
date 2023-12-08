import Stripe from "stripe";

const stripe = new Stripe(
  `sk_test_51HJ1BnJcyUgdRl8PjkM5tBJqp2fFRN4MEq9uydSEpVRiYyA0tGVmsKQZbpvwSRUdwg1grKG9F4HG6InHsrPhqz5O00lNb9hDlD`
);


export async function createPaymentIntent(amount, currency = 'USD') {
  return stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
  });
}