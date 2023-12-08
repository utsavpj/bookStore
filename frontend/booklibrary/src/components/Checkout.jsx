import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./Checkoutform";


// Pass the appearance object to the Elements instance
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_51HJ1BnJcyUgdRl8Pdj4poynk2rhgMxeeHUIkRcE4EGiJFMiOaECmDrTzVdqR7UmkJtH28ZJTWmsJjbeuT90Pcyvj00B86oYWm7");
export default function Checkout({clientSecret, amount}) {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: clientSecret,
  };
  
  return (
    <Elements stripe={stripePromise} options={options}>
      Please complete your payment: ${amount}
      <CheckoutForm />
    </Elements>
  );
}
