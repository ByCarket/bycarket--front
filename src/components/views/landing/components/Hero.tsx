"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative w-full bg-[#103663] py-16 px-6 text-left overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#4A77A8] rounded-bl-[160px] md:rounded-bl-[240px]" />

      <div className="relative z-10 text-white pl-10 md:pl-40">
        <h1 className="text-7xl md:text-9xl font-bold mb-4">ByCarket</h1>
        <p className="text-5xl mb-8 leading-snug">
          Nunca fue
          <br />
          tan <span className="font-bold italic">fácil</span>
          <br />
          vender tu
          <br />
          auto
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-white text-[#103663] hover:bg-gray-200 font-semibold px-6 py-3 rounded-2xl shadow transition"
        >
          Descubre
        </button>
      </div>
    </section>
  );
}
