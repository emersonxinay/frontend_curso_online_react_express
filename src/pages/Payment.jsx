import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import PayPalButton from '../components/PayPalButton';
import StripeCheckout from '../components/StripeCheckout';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (order) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/enroll`,
        { orderId: order.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      navigate(`/curso/${courseId}/contenido`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleStripePayment = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/payments/create-checkout-session',
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (error) {
        console.error('Error:', error);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Purchase
          </h2>
          
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
            <p className="mt-2 text-gray-600">{course.description}</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <span className="text-gray-600">Course Price:</span>
            <span className="text-2xl font-bold text-gray-900">${course.price}</span>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`px-4 py-2 rounded-md ${
                  paymentMethod === 'paypal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                PayPal
              </button>
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`px-4 py-2 rounded-md ${
                  paymentMethod === 'stripe'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Credit Card
              </button>
            </div>
          </div>

          {paymentMethod === 'paypal' ? (
            <PayPalScriptProvider options={{
              "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID
            }}>
              <PayPalButton
                amount={course.price}
                courseId={courseId}
                onSuccess={handlePaymentSuccess}
              />
            </PayPalScriptProvider>
          ) : (
            <StripeCheckout
              courseId={courseId}
              amount={course.price}
              onCheckout={handleStripePayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}