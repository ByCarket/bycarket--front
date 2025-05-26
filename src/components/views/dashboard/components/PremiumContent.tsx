"use client";

import { useState, useEffect } from "react";
import {
  getMonthlyPrice,
  getQuarterlyPrice,
  getAnnualPrice,
  createSubscription,
  Price,
} from "@/services/api.service";
import { useRouter } from "next/navigation";
import { setSessionId } from "@/services/storage.service";

export default function PremiumPricing() {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState<Record<string, Price | null>>({
    monthly: null,
    quarterly: null,
    annual: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const monthlyData = await getMonthlyPrice();
        const quarterlyData = await getQuarterlyPrice();
        const annualData = await getAnnualPrice();

        setPrices({
          monthly: monthlyData.data,
          quarterly: quarterlyData.data,
          annual: annualData.data,
        });
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  const getPlanAmount = (plan: string) => {
    const price = prices[plan];
    if (!price || price.unit_amount === undefined) return "--";
    return (price.unit_amount / 100).toFixed(2);
  };

  const plans = [
    {
      id: "monthly",
      name: "Mensual",
      get price() {
        const amount = getPlanAmount("monthly");
        return amount === "--" ? 0 : parseFloat(amount);
      },
      period: "mes",
      popular: false,
    },
    {
      id: "quarterly",
      name: "Trimestral",
      get price() {
        const amount = getPlanAmount("quarterly");
        return amount === "--" ? 0 : parseFloat(amount);
      },
      period: "3 meses",
      popular: true,
      savings: "Ahorra 10%",
    },
    {
      id: "annual",
      name: "Anual",
      get price() {
        const amount = getPlanAmount("annual");
        return amount === "--" ? 0 : parseFloat(amount);
      },
      period: "año",
      popular: false,
      savings: "Ahorra 20%",
    },
  ];

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const priceId = prices[selectedPlan]?.id;

      if (!priceId) {
        throw new Error("No se encontró el precio seleccionado");
      }
      
      const planInfo = plans.find(p => p.id === selectedPlan);
      const amount = planInfo?.price || 0;
      
      localStorage.setItem("subscription_plan_info", JSON.stringify({ 
        plan: selectedPlan, 
        amount: amount
      }));
      
      const response = await createSubscription(priceId);
      
      if (typeof response === "string") {
        window.location.href = response;
        return;
      }
      
      if (response?.url) {
        window.location.href = response.url;
        return;
      }
      
      throw new Error("No se pudo completar la solicitud");
    } catch (error) {
      router.push(
        `/dashboard/error?message=${encodeURIComponent(
          error instanceof Error ? error.message : "Error al procesar el pago"
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#103663" }}>
            Premium
          </h1>
          <p className="text-xl" style={{ color: "#4a77a8" }}>
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedPlan === plan.id
                  ? "shadow-2xl border-2"
                  : "shadow-lg border border-gray-200 hover:shadow-xl"
              }`}
              style={{
                backgroundColor: selectedPlan === plan.id ? "#103663" : "white",
                borderColor: selectedPlan === plan.id ? "#103663" : "#e5e7eb",
              }}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: "#4a77a8" }}
                >
                  Más Popular
                </div>
              )}

              <div className="text-center">
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    selectedPlan === plan.id ? "text-white" : ""
                  }`}
                  style={{
                    color: selectedPlan === plan.id ? "white" : "#103663",
                  }}
                >
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span
                    className={`text-5xl font-bold ${
                      selectedPlan === plan.id ? "text-white" : ""
                    }`}
                    style={{
                      color: selectedPlan === plan.id ? "white" : "#103663",
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-lg ml-2 ${
                      selectedPlan === plan.id ? "text-gray-200" : ""
                    }`}
                    style={{
                      color: selectedPlan === plan.id ? "#e5e7eb" : "#4a77a8",
                    }}
                  >
                    USD / {plan.period}
                  </span>
                </div>

                {plan.savings && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-6"
                    style={{
                      backgroundColor:
                        selectedPlan === plan.id ? "#4a77a8" : "#f0f9ff",
                      color: selectedPlan === plan.id ? "white" : "#4a77a8",
                    }}
                  >
                    {plan.savings}
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  {[
                    "Ventaja 1",
                    "Ventaja 2",
                    "Ventaja 3",
                    "Ventaja 4",
                    "Ventaja 5",
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{
                          color:
                            selectedPlan === plan.id ? "#4a77a8" : "#10b981",
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`text-sm ${
                          selectedPlan === plan.id ? "text-gray-200" : ""
                        }`}
                        style={{
                          color:
                            selectedPlan === plan.id ? "#e5e7eb" : "#4a77a8",
                        }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubscription}
                  disabled={loading || !prices[plan.id]}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:transform hover:scale-105 ${
                    selectedPlan === plan.id
                      ? "text-white hover:opacity-90"
                      : "text-white hover:opacity-90"
                  } ${
                    loading || !prices[plan.id]
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedPlan === plan.id ? "#4a77a8" : "#103663",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    "Consiguelo ya!"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm" style={{ color: "#4a77a8" }}>
            Procesamiento seguro con Stripe • Cancela en cualquier momento
          </p>
        </div>
      </div>
    </div>
  );
}
