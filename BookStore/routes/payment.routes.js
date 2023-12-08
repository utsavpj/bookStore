import express from 'express';
import stripeLib from 'stripe';
import bodyParser from 'body-parser';

const stripe = stripeLib('sk_test_51Nsr57IKWKaCzW6hlGDg0GHN7F3kktuIdlbJrI0wmbZCHbsxIDMSlJ1FtiRVWCBo2B8FaK72hD0WmIl5ODr5pIeK00rIrdekY6');

const app = express.Router();

app.post('/create-payment', async(req, res) => {
    const {items, customerId} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        customer:customerId
      });
      res.json({ clientSecret: paymentIntent.client_secret });
});



