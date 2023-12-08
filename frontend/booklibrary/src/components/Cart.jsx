import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Checkout from "./Checkout";

export default function Cart({ userData }) {
  const [cartData, setcartData] = useState([]);
  const [loadingCartDetails, setLoadingCartDetails] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [stripClientSecret, setStripeClientSecret] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [totalAmount, setTotalAmount] = useState("0");

  useEffect(() => {
    const fetchCustomerCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/customer/fetchCartItems/${userData._id}`
        );
        const data = await response.json();
        if (response.ok) {
          // Reset cartData before fetching new details
          setcartData([]);

          // Create an array of promises for fetching book details
          const fetchPromises = data.cartItems.map((book) => {
            return fetchBookDetails(book);
          });

          // Wait for all promises to resolve
          const bookDetails = await Promise.all(fetchPromises);

          console.log(bookDetails);
          setLoadingCartDetails(true);
          // Update cartData with the resolved book details
          setcartData(bookDetails);
        } else {
          console.error("Failed to fetch book details:", response.statusText);
        }
      } catch (error) {
        console.error("Error during book details fetch:", error);
      }
    };

    const fetchBookDetails = async (item) => {
      try {
        const response = await fetch(
          `http://localhost:8080/books/${item.bookId}`
        );
        if (response.ok) {
          const bookDetail = await response.json();
          bookDetail.quantity = item.quantity;
          return bookDetail;
        } else {
          console.error("Failed to fetch book details:", response.statusText);
          return null;
        }
      } catch (error) {
        console.error("Error during book details fetch:", error);
        return null;
      }
    };

    // Fetch details for each book in the cart
    fetchCustomerCart();
  }, [userData]);


  const handleOrderNow = async () => {
    console.log(userData.cart)
    try {
      // Make a patch request to update the order status
      const orderResp = await fetch(
        `http://localhost:8080/orders/customer/placeOrder/${userData._id}`,
        {
          method: "POST",
          headers: {
            Authorization: userData.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            books: userData.cart,
            orderOptions: "Pickup",
          }),
        }
      );

      if (orderResp.status == 201) {
        let body = await orderResp.json();
        let { paymentClientSecret, paymentCurrency, amountInCents } = body;

        setStripeClientSecret(paymentClientSecret);
        setTotalAmount(amountInCents);
        setShowPayment(true);
      } else {
        // Handle patch request failure
        console.error("Failed to update order status:", orderResp.statusText);
        toast.error("something went wrong.");
      }
    } catch (error) {
      // Handle other errors
      console.error("Error during order placement:", error);
    }
  };

  return (
    <div className="">
      {!showPayment && (
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cart
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              {cartData ? (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-b border-t border-gray-200"
                >
                  {cartData.map((product) => (
                    <li key={product.book._id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <img
                          src={`data:image/png;base64, ${product.book?.bookImage}`}
                          alt={product.book.bookName}
                          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <a
                                  href="#"
                                  className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                  {product.book.bookName}
                                </a>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              <p className="text-gray-500">
                                {product.book.bookAuthor}
                              </p>
                            </div>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              $ {product.book.bookPrice}
                            </p>
                          </div>

                          <div className="mt-4 sm:mt-0 sm:pr-9">
                            <label
                              htmlFor={`quantity-${product.quantity}`}
                              className="sr-only"
                            >
                              Quantity, {product.book.name}
                            </label>
                            <select
                              id={`quantity-${product.quantity}`}
                              name={`quantity-${product.quantity}`}
                              value={product.quantity}
                              className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value={product.quantity}>
                                {product.quantity}
                              </option>
                            </select>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700"></p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <>Cart is empty</>
              )}
            </section>
            <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
          <button
          type="button"
          onClick={() => handleOrderNow()}
          className="w-full rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Order now
        </button>
          </section>
          </form>
        </div>
      )}

      {showPayment && (
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Payments</h3>
        <Checkout clientSecret={stripClientSecret} amount={totalAmount} />
      </div>
       
      )}
    </div>
  );
}
