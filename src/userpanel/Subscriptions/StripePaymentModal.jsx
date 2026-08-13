import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, X, ShieldCheck, Loader2 } from 'lucide-react';

// Load Stripe outside of component to avoid recreating Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_dummy');

const CheckoutForm = ({ plan, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    // In a real app, you would fetch a clientSecret from your backend and use confirmCardPayment.
    // For this demo, we will use createPaymentMethod which works entirely on the frontend.
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Simulate network delay for demo
      setTimeout(() => {
        setProcessing(false);
        onSuccess(paymentMethod);
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Credit or Debit Card
        </label>
        <div className="bg-white p-3 rounded-lg border border-slate-200">
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
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
        <ShieldCheck className="w-4 h-4" />
        <span>Payments are secure and encrypted. Sandbox Mode is active.</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-slate-850 hover:bg-slate-900 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing Demo...
          </>
        ) : (
          `Pay ${plan.price}`
        )}
      </button>
    </form>
  );
};

export default function StripePaymentModal({ plan, onClose, onSuccess }) {
  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-md w-full shadow-2xl relative overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                Stripe Sandbox
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Upgrade Request to <span className="font-bold text-indigo-700">{plan.name}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              plan={plan} 
              onCancel={onClose} 
              onSuccess={onSuccess} 
            />
          </Elements>
        </div>

      </div>
    </div>
  );
}
