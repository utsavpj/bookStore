import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {formatMoney} from "../shared/money"


export default function SlideOverOrder({ order, open, onClose }) {
  console.log(order)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Order {order._id}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => onClose(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <table className="mt-4 w-full text-gray-500 sm:mt-6">
                        <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                            >
                              Book name
                            </th>
                            <th
                              scope="col"
                              className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                            >
                              Book Author
                            </th>
                            <th
                              scope="col"
                              className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                            >
                              Book Category
                            </th>
                            <th
                              scope="col"
                              className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                            >
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                          {order.books.map((obj) => (                            
                            <tr key={obj.book._id}>
                              <td className="py-6 pr-8">
                                <div>{obj.book.bookName}</div></td>
                              <td className="py-6 pr-8">{obj.book.bookAuthor}</td>
                              <td className="py-6 pr-8">{obj.book.bookCategory}</td>
                              <td className="py-6 pr-8">{formatMoney(obj.book.bookPrice*100)}</td>
                              <td className="py-6 pr-8">{obj.quantity}</td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
