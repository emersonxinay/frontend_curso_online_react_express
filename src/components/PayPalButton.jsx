import { PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from 'react';

export default function PayPalButton({ amount, courseId, onSuccess }) {
  const [error, setError] = useState(null);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: "USD"
          },
          description: `Course Purchase - ${courseId}`
        }
      ]
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      const response = await fetch(`http://localhost:5000/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: order.id,
          courseId: courseId,
          amount: amount
        })
      });

      if (!response.ok) throw new Error('Payment verification failed');
      
      onSuccess(order);
    } catch (error) {
      setError('Payment processing failed. Please try again.');
    }
  };

  return (
    <div>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => setError('PayPal encountered an error. Please try again.')}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        }}
      />
      {error && (
        <div className="mt-4 text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}