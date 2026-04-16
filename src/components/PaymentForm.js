import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCreditCard } from '@fortawesome/free-solid-svg-icons';

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create Payment Intent on backend
      const { data } = await paymentAPI.process({ amount: Math.round(amount * 100) }); // Stripe expects cents
      const clientSecret = data.client_secret;

      // 2. Confirm Payment on frontend
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onSuccess(result.paymentIntent.id);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment processing failed');
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '14px',
        color: '#1A1A1A',
        fontFamily: 'Outfit, sans-serif',
        '::placeholder': {
          color: '#D1D5DB',
        },
      },
      invalid: {
        color: '#E31837',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm">
            <FontAwesomeIcon icon={faCreditCard} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Payment Details</h3>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Secure Stripe encryption</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/10 transition-all">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="flex flex-col gap-3">
             <button
                type="submit"
                disabled={!stripe || loading}
                className="btn-primary w-full h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all"
             >
                {loading ? (
                   <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                   <span className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faLock} className="text-[10px]" />
                      Pay Rs. {amount.toFixed(0)} Securely
                   </span>
                )}
             </button>
             
             <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="text-[11px] font-bold text-gray-400 hover:text-neutral-900 transition-colors uppercase tracking-widest py-2"
             >
                Cancel and use different method
             </button>
          </div>
        </form>
      </div>
      
      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
         By completing this purchase, you agree to the SmartBite Terms & Conditions. 
         Your payment is processed by Stripe for 100% security.
      </p>
    </div>
  );
};

export default PaymentForm;
