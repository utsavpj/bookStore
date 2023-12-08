import { useSearchParams } from "react-router-dom";

export default function PaymentComplete() {
  const [searchParams, setSearchParams ] = useSearchParams();
  return (
    <>
      <h1>Payment Confirmation</h1>
      <div>Payment Intent: {searchParams.get('payment_intent')}</div>
      <div>redirect status: {searchParams.get('redirect_status')}</div>
    </>
  );
}
