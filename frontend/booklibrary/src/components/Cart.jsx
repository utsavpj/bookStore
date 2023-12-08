import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Cart({ userData }) {
  const [cartData, setcartData] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatedCartData, setUpdatedCart] = useState();

  console.log("userdata: ", userData);
  useEffect(() => {
    const fetchCustomerCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/customer/fetchCartItems/${userData._id}`
        );
        const data = await response.json();
        if (response.ok) {
          // setUpdatedCart
          data.cartItems.forEach((book) => {
            fetchBookDetails(book);
          });
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
          setcartData((prevDetails) => [...prevDetails, bookDetail]);
        } else {
          console.error("Failed to fetch book details:", response.statusText);
        }
      } catch (error) {
        console.error("Error during book details fetch:", error);
      }
    };

    // Fetch details for each book in the cart
    fetchCustomerCart();
  }, [userData.cart]);


  const handleCheckout = () => {
    
  }

  const handleOrderNow = async () => {
    console.log("Books: ", userData.cart)
    try {
      // Make a patch request to update the order status
      const patchResponse = await fetch(`http://localhost:8080/orders/customer/placeOrder/${userData._id}`, {
        method: 'POST',
        headers: {
          Authorization: userData.token,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          books : userData.cart, 
          orderOptions: "Pickup", 
        }),
      });

      if (patchResponse.ok) {
        // If the patch request is successful, proceed with the post request
        // const postResponse = await fetch('your_post_endpoint', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     books,
        //     orderOptions,
        //     customerIdStripeAccount,
        //     payment_method,
        //   }),
        // });

        console.log(patchResponse)

        // if (postResponse.ok) {
        //   // If the post request is successful, update the state or perform other actions
        //   setShowOrderDetails(true);
        // } else {
        //   // Handle post request failure
        //   console.error('Failed to place the order:', postResponse.statusText);
        // }
      } else {
        // Handle patch request failure
        console.error('Failed to update order status:', patchResponse.statusText);
      }
    } catch (error) {
      // Handle other errors
      console.error('Error during order placement:', error);
    }
  };

  return (
    <div className="">
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
                  <li key={product.books._id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.books.bookImage}
                        alt={product.books.bookName}
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
                                {product.books.bookName}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">
                              {product.books.bookAuthor}
                            </p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            $ {product.books.bookPrice}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${product.books.quantity}`}
                            className="sr-only"
                          >
                            Quantity, {product.books.name}
                          </label>
                          <select
                            id={`quantity-${product.books.quantity}`}
                            name={`quantity-${product.books.quantity}`}
                            value={product.quantity}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value={product.quantity}>{product.quantity}</option>
                          </select>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
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

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
          {!showOrderDetails &&
                        <button
                type="button"
                onClick={() => handleOrderNow()}
                className="w-full rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Order now
              </button>
          }
          {showOrderDetails && (
                <>
            <h2
              id="summary-heading"
              className="text-lg mt-6 font-medium text-gray-900"
            >
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex text-sm text-gray-600">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$8.32</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">$112.32</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => handleCheckout()}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
            </>
              )}
          </section>
        </form>
      </div>
    </div>
  );
}
