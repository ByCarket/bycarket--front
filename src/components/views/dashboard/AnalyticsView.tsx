"use client";

import React, { useEffect } from "react";

const AnalyticsView = () => {
    useEffect(() => {
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#0B1F3A";
        return () => {
            document.body.style.backgroundColor = originalBg;
        };
    }, []);

    const analytics = {
        sales: 7,
        listings: 12,
        favorites: 18,
        visits: 320,
        contacts: 85,
    };

    const cards = [
        {
            title: "Autos Vendidos",
            value: analytics.sales,
            icon: "🚗",
        },
        {
            title: "Autos Publicados",
            value: analytics.listings,
            icon: "📢",
        },
        {
            title: "Favoritos",
            value: analytics.favorites,
            icon: "❤️",
        },
        {
            title: "Visitas",
            value: analytics.visits,
            icon: "👁️",
        },
        {
            title: "Contactos",
            value: analytics.contacts,
            icon: "✉️",
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-r from-principal-blue to-secondary-blue p-10 text-white font-sans">
            <h1 className="text-4xl font-semibold mb-10 text-center">Panel de Analíticas</h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-3xl p-6 shadow-lg text-black flex flex-col items-start hover:scale-[1.02] transition-transform duration-200"
                    >
                        <div className="text-3xl mb-2">{card.icon}</div>
                        <h2 className="text-lg font-medium text-gray-700 mb-1">
                            {card.title}
                        </h2>
                        <p className="text-4xl font-bold text-[#0B1F3A]">
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default AnalyticsView;