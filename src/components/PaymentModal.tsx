import React from 'react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onDevBypass?: () => void;
  plan?: 'monthly' | 'yearly';
  email?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, onDevBypass, plan, email }) => {
  const handleStripeCheckout = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    const selectedPlan = plan || window.prompt('Plan (monthly/yearly)?', 'monthly') as 'monthly' | 'yearly';
    const userEmail = email || window.prompt('Your email?');
    if (!selectedPlan || !userEmail) {
      alert('Missing plan or email');
      return;
    }
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, email: userEmail }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error: ' + err);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Payment</h2>
        <p className="mb-6 text-center">Choose Google Pay, Apple Pay, or enter your card to start your 7-day trial.</p>
        {/* Payment buttons */}
        <div className="flex flex-col gap-4 mb-6">
          <button
            className="w-full py-3 rounded bg-white text-black font-semibold flex items-center justify-center gap-2 border border-gray-400 hover:border-seafoam hover:shadow transition-colors text-lg"
            onClick={handleStripeCheckout}
            type="button"
          >
            {/* Official Google Pay SVG badge */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 24" width="48" height="24" aria-label="Google Pay logo">
              <g>
                <path fill="#4285F4" d="M9.24 10.48v2.06h5.05c-.08.66-.57 1.66-1.65 2.34l-.01.08 2.39 1.86.17.02c1.56-1.44 2.46-3.56 2.46-6.3 0-.52-.05-1.03-.13-1.52H9.24z"/>
                <path fill="#34A853" d="M12.61 16.88c2.22 0 4.08-.74 5.44-2.01l-2.6-2.02c-.7.48-1.62.82-2.84.82-2.18 0-4.04-1.47-4.7-3.45l-.08.01-2.55 1.98-.03.08c1.34 2.67 4.15 4.59 7.36 4.59z"/>
                <path fill="#FBBC05" d="M7.91 10.22c-.2-.59-.31-1.21-.31-1.86 0-.65.11-1.27.3-1.86V6.42l-2.58-2-.08.03C4.46 5.09 4 6.5 4 8c0 1.5.46 2.91 1.25 4.12l2.66-2.07z"/>
                <path fill="#EA4335" d="M12.61 7.95c1.21 0 2.03.52 2.5.96l1.83-1.78C15.63 5.61 14.01 4.88 12.61 4.88c-3.21 0-6.02 1.92-7.36 4.59l2.66 2.07c.36-1.09 1.4-3.59 4.7-3.59z"/>
                <path fill="#4285F4" d="M20.5 9.5h2.05v6.98h-2.05zM21.53 6.5a1.19 1.19 0 0 1 1.19 1.19c0 .66-.54 1.19-1.19 1.19a1.19 1.19 0 0 1 0-2.38zM24.41 11.99c0-1.11.09-2.02.26-2.77.25-1.06 1.13-1.8 2.23-1.8.86 0 1.4.34 1.72.7V7.5h2.03v6.98h-2.03v-.57c-.32.37-.86.7-1.72.7-1.1 0-1.98-.74-2.23-1.8-.17-.75-.26-1.66-.26-2.77zm2.49 2.16c.64 0 1.07-.24 1.28-.47v-3.38c-.21-.23-.64-.47-1.28-.47-.71 0-1.13.4-1.13 1.16v2c0 .76.42 1.16 1.13 1.16zm4.47-2.16c0-1.11.09-2.02.26-2.77.25-1.06 1.13-1.8 2.23-1.8.86 0 1.4.34 1.72.7V7.5h2.03v6.98h-2.03v-.57c-.32.37-.86.7-1.72.7-1.1 0-1.98-.74-2.23-1.8-.17-.75-.26-1.66-.26-2.77zm2.49 2.16c.64 0 1.07-.24 1.28-.47v-3.38c-.21-.23-.64-.47-1.28-.47-.71 0-1.13.4-1.13 1.16v2c0 .76.42 1.16 1.13 1.16zm7.38-2.16c0 2.04-1.26 3.28-3.1 3.28-1.84 0-3.1-1.24-3.1-3.28 0-2.04 1.26-3.28 3.1-3.28s3.1 1.24 3.1 3.28zm-2.03 0c0-1.11-.51-1.56-1.07-1.56-.56 0-1.07.45-1.07 1.56s.51 1.56 1.07 1.56c.56 0 1.07-.45 1.07-1.56zm2.65 1.79h2.03v.7c.31-.41.84-.7 1.68-.7 1.19 0 1.85.66 1.85 1.82v3.37h-2.03v-2.93c0-.51-.22-.79-.72-.79-.47 0-.78.3-.78.79v2.93h-2.03v-6.98zm6.72 2.13c0-.41-.33-.74-.74-.74-.41 0-.74.33-.74.74 0 .41.33.74.74.74.41 0 .74-.33.74-.74zm-1.5 1.81c0-1.11.09-2.02.26-2.77.25-1.06 1.13-1.8 2.23-1.8.86 0 1.4.34 1.72.7V7.5h2.03v6.98h-2.03v-.57c-.32.37-.86.7-1.72.7-1.1 0-1.98-.74-2.23-1.8-.17-.75-.26-1.66-.26-2.77zm2.49 2.16c.64 0 1.07-.24 1.28-.47v-3.38c-.21-.23-.64-.47-1.28-.47-.71 0-1.13.4-1.13 1.16v2c0 .76.42 1.16 1.13 1.16z"/>
              </g>
            </svg>
            <span className="ml-3">Pay with Google Pay</span>
          </button>
          <button
            className="w-full py-3 rounded bg-white text-black font-semibold flex items-center justify-center gap-2 border border-gray-400 hover:border-seafoam hover:shadow transition-colors text-lg"
            onClick={handleStripeCheckout}
            type="button"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" className="h-6 w-6" />
            Pay with Apple Pay
          </button>
        </div>
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-3 text-gray-400 text-sm">or pay with card</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        {/* Credit card input */}
        <form className="flex flex-col gap-3" onSubmit={handleStripeCheckout}>
          <button
            type="submit"
            className="w-full py-3 rounded bg-seafoam text-maineBlue font-bold text-lg hover:bg-maineBlue hover:text-seafoam transition-colors"
          >
            Pay
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Apple Pay, Google Pay, and card options will be available on the next screen.
        </p>
        <p className="mt-6 text-xs text-gray-500 text-center">Payments are securely processed. You’ll be redirected to your dashboard after payment.</p>
        {onDevBypass && (
          <button
            className="w-full mt-4 py-2 rounded bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            onClick={onDevBypass}
            type="button"
          >
            Dev Bypass: Go to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
