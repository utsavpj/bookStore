import { useEffect, useState } from "react";
import { formatDate } from "../shared/date";
import {formatMoney} from "../shared/money"
import { toast } from "react-toastify";

export default function OrderList({userData}) {
  let [loading, setLoading] = useState(true);
  let [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/orders/customer/${userData._id}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders)
          setLoading(false)
        } else {
          toast.error('failed to load orders')
          console.error("Failed to fetch orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error during orders fetch:", error);
        toast.error('failed to load orders')
      }
    };

    // Fetch details for each book in the cart
    fetchOrders();
  }, [userData]);

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Recent orders
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders
          </p>
        </div>

        <div className="mt-16">
          {loading && (
            <div className="mt-16">
              <span>Loading...</span>{" "}
            </div>
          )}

          {!loading && (
            <table className="mt-4 w-full text-gray-500 sm:mt-6">
              <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                <tr>
                  <th
                    scope="col"
                    className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                  >
                    Number
                  </th>
                  <th
                    scope="col"
                    className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pr-8 font-normal sm:table-cell"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="hidden py-3 pr-8 font-normal sm:table-cell"
                  >
                    Amount
                  </th>
                  <th scope="col" className="w-0 py-3 text-right font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="py-6 pr-8">
                      <div className="flex items-center font-medium text-gray-900">
                        {order._id}
                      </div>
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      {order.orderStatus}
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      {order.orderOptions}
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      {formatMoney(order.amount)}
                    </td>
                    <td className="hidden py-6 pr-8 sm:table-cell">
                      <button className="btn text-indigo-600">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
