import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  getUserInvoices,
  updateUserSubscription,
} from "@/services/api.service";

import { showError, showSuccess } from "@/app/utils/Notifications";

export enum StatusInvoice {
  PAID = "paid",
  UNPAID = "unpaid",
  PENDING = "pending",
  CANCELED = "canceled",
}

export interface Invoice {
  id: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  period_end: Date;
  period_start: Date;
  status: StatusInvoice | null;
  total: number;
  amount_paid: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Subscription {
  id: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  plan_name?: string;
  invoices: Invoice[];
}

export interface SubscriptionResponse {
  user: User;
  subscription: Subscription;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const getStatusIcon = (status: StatusInvoice | null) => {
  switch (status) {
    case StatusInvoice.PAID:
      return <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500" />;
    case StatusInvoice.UNPAID:
      return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />;
    case StatusInvoice.PENDING:
      return <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />;
    case StatusInvoice.CANCELED:
      return <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />;
  }
};

const getStatusText = (status: StatusInvoice | null): string => {
  switch (status) {
    case StatusInvoice.PAID:
      return "Pagada";
    case StatusInvoice.UNPAID:
      return "Pendiente de pago";
    case StatusInvoice.PENDING:
      return "Procesando";
    case StatusInvoice.CANCELED:
      return "Cancelada";
    default:
      return "Sin estado";
  }
};

const getStatusColor = (status: StatusInvoice | null): string => {
  switch (status) {
    case StatusInvoice.PAID:
      return "bg-green-50 text-green-700 border-green-200";
    case StatusInvoice.UNPAID:
      return "bg-red-50 text-red-700 border-red-200";
    case StatusInvoice.PENDING:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case StatusInvoice.CANCELED:
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-500 border-gray-200";
  }
};

export default function InvoiceSection() {
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserInvoices();
        setSubscriptionData(data);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setError("Error al cargar las facturas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadPDF = (invoice: Invoice) => {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, "_blank");
      showSuccess("Descargando factura");
    } else {
      showError("No se pudo descargar la factura");
    }
  };

  const handleViewHosted = (invoice: Invoice) => {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, "_blank");
      showSuccess("Abriendo factura en línea");
    } else {
      showError("No se pudo abrir la factura");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-64 mb-8"></div>
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                  >
                    <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                Error al cargar las facturas
              </h2>
              <p className="text-slate-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#103663] text-white rounded-lg hover:bg-[#0f2e56] transition-colors"
              >
                Intentar nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscriptionData || !subscriptionData.subscription.invoices.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                No hay facturas disponibles
              </h2>
              <p className="text-slate-500">
                Cuando tengas facturas, aparecerán aquí.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { user, subscription } = subscriptionData;
  const invoices = subscription.invoices.sort(
    (a, b) =>
      new Date(b.period_end).getTime() - new Date(a.period_end).getTime()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Mis Facturas
            </h1>
            <p className="text-slate-600">
              Gestiona y descarga tus facturas de{" "}
              {subscription.plan_name || "suscripción"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-1">
                  Información de la suscripción
                </h2>
                <p className="text-slate-600">{user.email}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
                <div className="text-center md:text-right">
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                    Plan actual
                  </p>
                  <p className="text-lg font-semibold text-slate-800">
                    {subscription.plan_name}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">
                    Estado
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    {subscription.status === "active"
                      ? "Activa"
                      : subscription.status}
                  </span>
                </div>
              </div>
              {subscription.status === "active" && (
                <button
                  onClick={async () => {
                    try {
                      await updateUserSubscription();
                      showSuccess("Suscripción cancelada exitosamente");
                      window.location.reload();
                    } catch (error) {
                      showError("Error al cancelar la suscripción");
                      console.error("Error al cancelar la suscripción:", error);
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-4 md:mt-0"
                >
                  Cancelar Suscripción
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-6">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
                        <h3 className="text-base md:text-lg font-semibold text-slate-800">
                          Factura #{invoice.id}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {getStatusText(invoice.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500">Período</p>
                          <p className="text-slate-800 font-medium">
                            {formatDate(invoice.period_start)} -{" "}
                            {formatDate(invoice.period_end)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500">Total</p>
                          <p className="text-slate-800 font-medium">
                            {formatCurrency(invoice.total)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500">Pagado</p>
                          <p className="text-slate-800 font-medium">
                            {formatCurrency(invoice.amount_paid)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500">Fecha de emisión</p>
                          <p className="text-slate-800 font-medium">
                            {formatDate(invoice.period_end)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 sm:gap-3 lg:w-auto xl:w-auto">
                    <button
                      onClick={() => handleViewHosted(invoice)}
                      className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="whitespace-nowrap">Ver factura</span>
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(invoice)}
                      className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                    >
                      <Download className="w-4 h-4" />
                      <span className="whitespace-nowrap">Descargar PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              ¿Necesitas ayuda con tus facturas?{" "}
              <a
                href="mailto:bycarket@gmail.com"
                className="text-slate-700 hover:text-slate-800 font-medium underline"
              >
                Contacta soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
