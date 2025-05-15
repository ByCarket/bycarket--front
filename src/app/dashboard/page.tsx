"use client";

import React, { useEffect } from "react";

const DashboardView = () => {
    useEffect(() => {
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#103663";

        return () => {
            document.body.style.backgroundColor = originalBg;
        };
    }, []);

    const user = {
        name: "Valentino Rossi",
        email: "valentinorossi@example.com",
        bio: "Vendedor en ByCarket desde 2021.",
        avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRetCtNsfwuticad2uh7IchEA29bdsxBpENJw&s",
        location: "Italia, Tavullia",
        joined: "Enero 2021",
        stats: {
            listings: 12,
            sold: 7,
            favorites: 18
        }
    };

    return (
        <main className="flex h-screen text-white">
          
            <section className="w-1/4 bg-[#103663] flex items-center justify-center">
                <div className="font-extralight text-9xl leading-tight whitespace-pre-line text-center ml-5">
                    Bienv{'\n'}enido{'\n'}de{'\n'}nuevo
                </div>
            </section>


            <section className="w-3/4 bg-[#4A77A8] mt-30 ml-10 p-8 rounded-tl-[50px] overflow-y-auto">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-white backdrop-blur-md shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
                        <img
                            src={user.avatarUrl}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#103663]"
                        />
                        <div className="flex-1 text-black">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-sm opacity-80 mb-2">{user.email}</p>
                            <p className="mb-4">{user.bio}</p>
                            <div className="text-sm opacity-80 space-y-1">
                                <p>📍 {user.location}</p>
                                <p>📅 Miembro desde {user.joined}</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button className="px-4 py-2 bg-[#4A77A8] border border-solid text-white rounded-xl hover:bg-[#103663] transition">
                                    Editar perfil
                                </button>
                                <button className="px-4 py-2 bg-[#4A77A8] border border-solid text-white rounded-xl hover:bg-[#103663] transition">
                                    Publicar auto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* //estaditicas  */}

                    <div className="mt-6 bg-white backdrop-blur-md shadow-sm rounded-2xl p-6 grid grid-cols-3 text-center text-black">
                        <div>
                            <p className="text-xl font-semibold">{user.stats.listings}</p>
                            <p className="text-sm opacity-80">Publicados</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold">{user.stats.sold}</p>
                            <p className="text-sm opacity-80">Vendidos</p>
                        </div>
                        <div>
                            <p className="text-xl font-semibold">{user.stats.favorites}</p>
                            <p className="text-sm opacity-80">Favoritos</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default DashboardView;