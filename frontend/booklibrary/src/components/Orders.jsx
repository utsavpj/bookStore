const orders = 
[
   { "message": "New order with Order id 656bcaabf51cee66b1838fe6 created successfully",
    "newOrder": {
        "customerId": "6567e4af38be48eb8367a018",
        "books": [
            {
                "book": {
                    "_id": "656a0ff5c82c47463d81c140",
                    "bookName": "Naruto SHipuden",
                    "bookCategory": "Anime",
                    "bookAuthor": "Paras",
                    "bookImage": "",
                    "bookDescription": "Truly Awesome.... book",
                    "__v": 0
                },
                "quantity": 4,
                "_id": "656bcaabf51cee66b1838fe7"
            }
        ],
        "orderStatus": "Pending",
        "orderOptions": "Delivery",
        "_id": "656bcaabf51cee66b1838fe6",
        "orderDate": "2023-12-03T00:24:11.173Z",
        "__v": 0
    },
    "confirmedPaymentIntent": {
        "id": "pi_3OJ3TiIKWKaCzW6h1DtrTLfI",
        "object": "payment_intent",
        "amount": 50,
        "amount_capturable": 0,
        "amount_details": {
            "tip": {}
        },
        "amount_received": 50,
        "application": null,
        "application_fee_amount": null,
        "automatic_payment_methods": {
            "allow_redirects": "always",
            "enabled": true
        },
        "canceled_at": null,
        "cancellation_reason": null,
        "capture_method": "automatic",
        "client_secret": "pi_3OJ3TiIKWKaCzW6h1DtrTLfI_secret_kflRp1ugChoOFEbZW6KaIPFtz",
        "confirmation_method": "automatic",
        "created": 1701563050,
        "currency": "usd",
        "customer": "cus_P7H2e7ZgPMw07l",
        "description": null,
        "invoice": null,
        "last_payment_error": null,
        "latest_charge": "ch_3OJ3TiIKWKaCzW6h16be2eBP",
        "livemode": false,
        "metadata": {},
        "next_action": null,
        "on_behalf_of": null,
        "payment_method": "pm_1OJ3TiIKWKaCzW6hdPBldKpk",
        "payment_method_configuration_details": null,
        "payment_method_options": {
            "card": {
                "installments": null,
                "mandate_options": null,
                "network": null,
                "request_three_d_secure": "automatic"
            }
        },
        "payment_method_types": [
            "card"
        ],
        "processing": null,
        "receipt_email": null,
        "review": null,
        "setup_future_usage": null,
        "shipping": null,
        "source": null,
        "statement_descriptor": null,
        "statement_descriptor_suffix": null,
        "status": "succeeded",
        "transfer_data": null,
        "transfer_group": null
    }
  }
  ];

  function formatDate(utcDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
    const formattedDate = new Date(utcDate).toLocaleString('en-US', options);
    return formattedDate;
  }


  
  export default function Orders() {


    return (
      <div className="">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage purchase and order details.
            </p>
          </div>
  
          <div className="mt-16">
            <h2 className="sr-only">Recent orders</h2>
  
            <div className="space-y-20">
              {orders.map((order,_) => (
                <div key={order._}>
                  <h3 className="sr-only">
                    Order placed on {formatDate(order.newOrder.date)}
                  </h3>
  
                  <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                    <dl className="flex-auto space-y-6 divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:space-y-0 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-10">
                      <div className="flex justify-between sm:block">
                        <dt className="font-medium text-gray-900">Date placed</dt>
                        <dd className="sm:mt-1">
                          <span>{formatDate(order.newOrder.date)}</span>
                        </dd>
                      </div>
                      <div className="flex justify-between pt-6 sm:block sm:pt-0">
                        <dt className="font-medium text-gray-900">Order number</dt>
                        <dd className="sm:mt-1">{order.newOrder._id}</dd>
                      </div>
                      <div className="flex justify-between pt-6 font-medium text-gray-900 sm:block sm:pt-0">
                        <dt>Total amount</dt>
                        <dd className="sm:mt-1">$ {order.confirmedPaymentIntent.amount}</dd>
                      </div>
                    </dl>
                    <a
                      href={order.invoiceHref}
                      className="mt-6 flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                    >
                      Cancel Order
                      <span className="sr-only">for order {order.number}</span>
                    </a>
                  </div>
  
                  <table className="mt-4 w-full text-gray-500 sm:mt-6">
                    <caption className="sr-only">Products</caption>
                    <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                      <tr>
                        <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                          Product
                        </th>
                        <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                         Quantity
                        </th>
                        <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                          Author
                        </th>
                        <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                          Status
                        </th>
                        <th scope="col" className="w-0 py-3 text-right font-normal">
                          Order Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                      {order.newOrder.books.map((product) => (
                        <tr key={product.id}>
                          <td className="py-6 pr-8">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">{product.book.bookName}</div>
                                <div className="mt-1 sm:hidden">{product.book.bookPrice}</div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">{product.quantity}</td>
                          <td className="hidden py-6 pr-8 sm:table-cell">{product.book.bookAuthor}</td>
                          <td className="hidden py-6 pr-8 sm:table-cell">{order.newOrder.orderStatus}</td>
                          <td className="whitespace-nowrap py-6 text-right font-medium">
                            <a href={product.href} className="text-indigo-600">
                                {order.newOrder.orderOptions}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  