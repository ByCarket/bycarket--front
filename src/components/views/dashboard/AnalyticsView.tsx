"use client";

import { ShoppingCart, Heart, Eye, Mail, FileText } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { useEffect } from "react";

const analytics = {
  sales: 7,
  listings: 12,
  favorites: 18,
  visits: 320,
  contacts: 85,
};

const salesData = [
  { name: "Ene", sales: 5 },
  { name: "Feb", sales: 7 },
  { name: "Mar", sales: 6 },
  { name: "Abr", sales: 8 },
  { name: "May", sales: 7 },
];

const favoritesGrowth = [
  { name: "Jan", value: 5 },
  { name: "Feb", value: 8 },
  { name: "Mar", value: 12 },
  { name: "Apr", value: 15 },
  { name: "May", value: 20 },
];

const interactions = [
  { name: "Jan", views: 100, clicks: 30 },
  { name: "Feb", views: 120, clicks: 45 },
  { name: "Mar", views: 150, clicks: 60 },
  { name: "Apr", views: 130, clicks: 50 },
  { name: "May", views: 160, clicks: 70 },
];

const cards = [
  {
    title: "Autos Vendidos",
    value: analytics.sales,
    icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
  },
  {
    title: "Autos Publicados",
    value: analytics.listings,
    icon: <FileText className="w-5 h-5 text-green-600" />,
  },
  {
    title: "Favoritos",
    value: analytics.favorites,
    icon: <Heart className="w-5 h-5 text-red-500" />,
  },
  {
    title: "Visitas",
    value: analytics.visits,
    icon: <Eye className="w-5 h-5 text-purple-500" />,
  },
  {
    title: "Contactos",
    value: analytics.contacts,
    icon: <Mail className="w-5 h-5 text-yellow-500" />,
  },
];

export default function AnalyticsView() {
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#f4f7fa";
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-t  p-10 text-gray-800 font-sans">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Panel de Analíticas
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow flex flex-col gap-2 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-gray-500">
                {card.title}
              </h2>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Tendencia de Ventas
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={salesData}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Crecimiento de Favoritos
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={favoritesGrowth}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow max-w-5xl mx-auto mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Interacciones por Mes
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={interactions}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="views" fill="#60a5fa" />
            <Bar dataKey="clicks" fill="#818cf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
