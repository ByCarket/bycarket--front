"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface SubscriptionInfo {
  plan: string;
  amount: number;
}

export default function SuccessView() {
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [transactionId, setTransactionId] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSession = () => {
      try {
        const sessionId = searchParams?.get("session_id");
        
        if (!sessionId) {
          router.push("/dashboard");
          return;
        }
        
        setTransactionId(sessionId);
        
        const storedInfo = localStorage.getItem("subscription_plan_info");
        if (storedInfo) {
          const parsedInfo = JSON.parse(storedInfo);
          setSubscriptionInfo(parsedInfo);
        } else {
          setSubscriptionInfo({
            plan: "monthly",
            amount: 750
          });
        }
        
        setTimeout(() => {
          setLoading(false);
          localStorage.removeItem("subscription_plan_info");
        }, 1000);
      } catch (error) {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    handleSession();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-principal-blue"></div>
      </div>
    );
  }

  if (!transactionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error en la transacción
          </h2>
          <p className="text-gray-600 mb-6">
            No se pudo verificar el estado de tu pago.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-principal-blue text-white px-6 py-2 rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-principal-blue to-secondary-blue p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-blue-100 text-lg">
              Tu suscripción ha sido activada
            </p>
          </div>

          <div className="p-8 space-y-8">
            <div className="text-center border-b border-gray-200 pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-principal-blue to-secondary-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Hola, Usuario
              </h2>
              <p className="text-gray-600 mb-4">
                Gracias por confiar en nosotros para tu experiencia automotriz
              </p>
              <div className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg inline-block">
                ID de transacción: {transactionId}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  className="w-6 h-6 text-principal-blue mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Resumen de tu compra
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Suscripción:
                  </span>
                  <span className="text-gray-800 font-semibold">{subscriptionInfo?.plan === "monthly" ? "Mensual" : subscriptionInfo?.plan === "quarterly" ? "Trimestral" : "Anual"}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Monto pagado:
                  </span>
                  <span className="text-2xl font-bold text-principal-blue">
                    ${subscriptionInfo?.amount || 0}
                  </span>
                </div>

                {transactionId && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">
                      ID de transacción:
                    </span>
                    <span className="text-sm text-gray-500 font-mono">
                      {transactionId.slice(-8)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-green-800 text-sm font-medium">
                    Tu acceso premium está activo y listo para usar
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800">
                  ¡Bienvenido a bordo!
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Estás listo para explorar el mundo automotriz con acceso
                  completo a todas nuestras funciones premium. Disfruta de la
                  experiencia más completa en vehículos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-gradient-to-r from-principal-blue to-secondary-blue text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                    />
                  </svg>
                  Ir al Dashboard
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-principal-blue hover:text-principal-blue transition-all duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
