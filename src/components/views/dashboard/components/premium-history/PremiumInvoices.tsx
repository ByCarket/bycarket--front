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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const handleCancelSubscription = async () => {
    try {
      await updateUserSubscription();
      showSuccess("Suscripción cancelada exitosamente");
      const data = await getUserInvoices();
      setSubscriptionData(data);
    } catch (error) {
      showError("Error al cancelar la suscripción");
    }
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <p className="text-center text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscriptionData?.subscription?.invoices?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <p className="text-center text-gray-600">
                No hay facturas disponibles
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
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Historial de Facturas</h2>
              <button
                onClick={() => setShowConfirmDialog(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Cancelar Suscripción
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left">Fecha</th>
                    <th className="py-3 px-4 text-left">Estado</th>
                    <th className="py-3 px-4 text-left">Monto</th>
                    <th className="py-3 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        {formatDate(invoice.period_end)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownloadPDF(invoice)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewHosted(invoice)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">
              ¿Confirmar cancelación?
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro que deseas cancelar tu suscripción? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
