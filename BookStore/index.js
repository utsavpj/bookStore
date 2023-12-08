import express from "express";
import mongoose from "mongoose";
import CustomerRouter from "./routes/Customer.routes.js";
import BookRouter from "./routes/Book.routes.js";
import ordersRouter from "./routes/order.routes.js";
import cors from "cors";
import dotenv from "dotenv";

// configuring the dotenv files to be used
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully!!"))
  .catch((err) => {
    console.log("Error connecting with database" + err);
    console.error(err);
    process.exit(1);
  });

app.use("/customer", CustomerRouter);
app.use("/books", BookRouter);
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
