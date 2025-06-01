import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { createSubscription, updateSubscription } from "@/services/api.service";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentElementProps {
  selectedPlanId: string;
  subscriptionId?: string;
  customerEmail?: string;
  onSuccess?: (subscription: any) => void;
  onError?: (error: string) => void;
}

function CheckoutForm({
  selectedPlanId,
  subscriptionId,
  customerEmail,
  onSuccess,
  onError,
}: PaymentElementProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Error al procesar el pago");
        onError?.(error.message || "Error al procesar el pago");
      } else if (paymentIntent.status === "succeeded") {
        onSuccess?.(paymentIntent);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al procesar el pago";
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card", "paypal"],
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Pagar ahora"
        )}
      </button>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </form>
  );
}

export default function PaymentElementWrapper(props: PaymentElementProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const loadStripeInstance = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    loadStripeInstance();
  }, []);

  useEffect(() => {
    if (!props.selectedPlanId || !stripe) return;

    const handleCheckout = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = {
          ...(props.customerEmail && { customer_email: props.customerEmail }),
          metadata: {
            created_at: new Date().toISOString(),
          },
        };

        let response;
        if (props.subscriptionId) {
          response = await updateSubscription(props.subscriptionId, data);
        } else {
          response = await createSubscription({
            id: props.selectedPlanId,
            ...data,
          });
        }

        if (response.session_id) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: response.session_id,
          });

          if (error) {
            throw error;
          }
        } else if (response.client_secret) {
          if (response.client_secret.startsWith("pi_")) {
            setClientSecret(response.client_secret);
          } else if (response.client_secret.startsWith("cs_")) {
            const { error } = await stripe.redirectToCheckout({
              sessionId: response.client_secret,
            });

            if (error) {
              throw error;
            }
          } else {
            throw new Error("Formato de client_secret no soportado");
          }
        } else {
          throw new Error(
            "No se pudo obtener la información de pago necesaria"
          );
        }
      } catch (error) {
        console.error("Error procesando el pago:", error);
        const errorMsg =
          error instanceof Error ? error.message : "Error al procesar el pago";
        setError(errorMsg);
        props.onError?.(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    handleCheckout();
  }, [
    props.selectedPlanId,
    props.subscriptionId,
    props.customerEmail,
    props.onError,
    stripe,
  ]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (clientSecret) {
    return (
      <Elements
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
          },
        }}
        stripe={stripePromise}
      >
        <CheckoutForm {...props} />
      </Elements>
    );
  }

  return null;
}
