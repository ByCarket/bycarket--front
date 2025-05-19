"use client";

import Link from "next/link";

import {
  ShoppingCart,
  Package,
  FileText,
  Bell,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Star,
  Phone,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const user = {
  name: "Valentino Rossi",
  email: "valentinorossi@example.com",
  bio: "Vendedor en ByCarket desde 2021.",
  avatarUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRetCtNsfwuticad2uh7IchEA29bdsxBpENJw&s",
  location: "Italia, Tavullia",
  joined: "Enero 2021",
};

const cards = [
  { title: "Vendidos", value: 121, icon: <ShoppingCart className="w-5 h-5" /> },
  { title: "Favoritos", value: 20, icon: <Package className="w-5 h-5" /> },
  { title: "Publicados", value: 51, icon: <FileText className="w-5 h-5" /> },
  { title: "Guardados", value: 54, icon: <Bell className="w-5 h-5" /> },
];

const salesData = [
  { name: "Ene", sales: 21 },
  { name: "Feb", sales: 19 },
  { name: "Mar", sales: 15 },
  { name: "Abr", sales: 12 },
  { name: "May", sales: 16 },
];

const tips = [
  "Actualiza tus publicaciones semanalmente para mantenerlas visibles.",
  "Responde rápido a los contactos para mejorar tu reputación.",
  "Utiliza fotos de alta calidad para atraer más compradores.",
  "Destaca los autos con promociones especiales o descuentos.",
  "Comparte tus publicaciones en redes sociales para mayor alcance.",
];

export default function DashboardView() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row text-gray-800 bg-secondary-blue p-4 sm:p-6 gap-6">
      <aside className="w-full lg:w-1/4 p-4 sm:p-6 shadow-xl rounded-xl flex flex-col space-y-8 bg-white">
        <div className="flex flex-col items-center">
          <img
            src={user.avatarUrl}
            alt={`Avatar de ${user.name}`}
            className="w-28 h-28 rounded-full border-4 border-principal-blue shadow-md"
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {user.name}
          </h2>
          <p className="text-center text-gray-600 mt-1">{user.bio}</p>
        </div>

        <div className="text-gray-700 space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            <span>
              Miembro desde <strong>{user.joined}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <span>+39 345 678 910</span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>
              Reputación: <strong>4.8/5</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>
              Plan: <strong>Vendedor Premium</strong>
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-3">Redes Sociales</h3>
          <nav className="flex flex-wrap gap-2">
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-black hover:bg-principal-blue hover:text-white transition"
            >
              Instagram
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-black hover:bg-principal-blue hover:text-white transition"
            >
              Facebook
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-black hover:bg-principal-blue hover:text-white transition"
            >
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/dashboard/analytics"
            className="w-full py-3 px-6 text-center font-semibold rounded-lg border border-principal-blue text-principal-blue hover:bg-principal-blue hover:text-white transition"
          >
            Analíticas
          </Link>
          <Link
            href="/analytics"
            className="w-full py-3 px-6 text-center font-semibold rounded-lg border border-principal-blue text-principal-blue hover:bg-principal-blue hover:text-white transition"
          >
            VIP
          </Link>
          <Link
            href="/analytics"
            className="w-full py-3 px-6 text-center font-semibold rounded-lg border border-principal-blue text-principal-blue hover:bg-principal-blue hover:text-white transition"
          >
            Suscripción
          </Link>
        </div>
      </aside>

      <section className="w-full flex-1 px-4 sm:px-6 py-6 space-y-6 bg-white shadow-xl rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white text-black p-4 rounded-xl flex flex-col gap-2 shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{card.title}</span>
                {card.icon}
              </div>
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">Ventas Generales</h3>
          <ResponsiveContainer width="100%" height={200}>
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

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4">
            Consejos para mejorar tus ventas
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white rounded-xl p-4 sm:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 flex-1 text-center md:text-left flex-col md:flex-row">
            <ShieldCheck className="w-12 h-12 text-yellow-400" />
            <div>
              <h3 className="text-2xl font-semibold">Suscripción Premium</h3>
              <p className="mt-1 text-md max-w-lg leading-relaxed">
                Accede a la inteligencia artificial para generar contenido
                automatizado y maximizar tus ventas con publicaciones
                optimizadas.
              </p>
            </div>
          </div>
          <button className="bg-yellow-400 text-indigo-900 font-semibold py-3 px-7 rounded-lg shadow-lg hover:bg-yellow-500 transition w-full md:w-auto">
            Ver más
          </button>
        </div>
      </section>
    </main>
  );
}
