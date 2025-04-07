import { useState } from 'react';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

function CheckoutForm({ onCheckout, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    try {
      await onCheckout();
    } catch (error) {
      setError(error.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          <>
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Pay ${amount}
          </>
        )}
      </button>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Your payment is processed securely with Stripe
      </p>
    </form>
  );
}

export default function StripeCheckout({ onCheckout, amount }) {
  return (
    <div className="w-full">
      <CheckoutForm onCheckout={onCheckout} amount={amount} />
    </div>
  );
}