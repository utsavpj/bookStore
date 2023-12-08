import { CheckIcon } from "@heroicons/react/20/solid";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentComplete() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center bg-green-50 p-8 rounded-lg">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-400">
          <CheckIcon className="h-6 w-6 text-green-100" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Payment Confirmation
        </h1>
        <p className=" mt-4 text-base font-semibold text-indigo-600">
        Payment Intent: {searchParams.get("payment_intent")}
        </p>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {searchParams.get("redirect_status")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <Link to="/view-orders" className="text-sm font-semibold text-gray-900">
            View all orders <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
