import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "../Api/axios";
import { AuthContext } from "../Auth/AuthContext";
import toast from "react-hot-toast";

// Load your Stripe publishable key from Vite env variables
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Package info with prices
const PACKAGE_DETAILS = {
  silver: { name: "Silver", price: 19.99 },
  gold: { name: "Gold", price: 29.99 },
  platinum: { name: "Platinum", price: 49.99 },
};

const CheckoutForm = ({ packageName, packagePrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // 1. Create payment intent on backend
      const { data } = await axiosInstance.post("/create-payment-intent", {
        amount: Math.round(packagePrice * 100), // Stripe expects amount in cents
        packageName,
        userEmail: user.email,
      });

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      // 2. Confirm card payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: user.email,
            name: user.displayName || "User",
          },
        },
      });

      // 3. Handle payment errors
      if (paymentResult.error) {
        toast.error(paymentResult.error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      // 4. On success, save payment info to DB
      if (paymentResult.paymentIntent.status === "succeeded") {
        await axiosInstance.post("/payments/save", {
          userEmail: user.email,
          packageName,
          paymentIntentId: paymentResult.paymentIntent.id,
          amount: packagePrice,
          status: "succeeded",
          purchasedAt: new Date(),
        });

        // 5. Update user badge in context
        setUser((prev) => ({
          ...prev,
          badge: packageName.charAt(0).toUpperCase() + packageName.slice(1),
        }));

        // 6. Show success toast and redirect
        toast.success("Payment successful! Your package has been upgraded.");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
    >
      <h3 className="text-xl font-bold mb-4">
        {packageName.charAt(0).toUpperCase() + packageName.slice(1)} Package - $
        {packagePrice.toFixed(2)}
      </h3>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
        className="mb-6 p-3 border rounded"
      />

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 rounded text-white font-semibold ${
          processing
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {processing ? "Processing..." : `Pay $${packagePrice.toFixed(2)}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { packageName } = useParams();
  const navigate = useNavigate();

  // Validate packageName param and get info
  const packageInfo = PACKAGE_DETAILS[packageName?.toLowerCase()];

  useEffect(() => {
    if (!stripeKey) {
      toast.error("Stripe is not configured.");
      console.error("❌ VITE_STRIPE_PUBLISHABLE_KEY is missing.");
    }

    if (!packageInfo) {
      toast.error("Invalid package selected.");
      navigate("/membership");
    }
  }, [packageInfo, navigate]);

  if (!packageInfo || !stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-600 text-lg font-semibold">
          Cannot proceed to checkout. Stripe is not configured or package is invalid.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-700">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          packageName={packageInfo.name.toLowerCase()}
          packagePrice={packageInfo.price}
        />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
