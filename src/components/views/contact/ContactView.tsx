"use client";

import { MessageCircleMore } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import contactImg from "../../../../public/assets/images/landing/contact-illustration.webp";
import { motion } from "framer-motion";

export default function ContactView() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-principal-blue px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full items-center">
        <div className="space-y-6 text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <MessageCircleMore className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            ¿Tenés dudas o consultas?
          </h1>
          <p className="text-white text-lg">
            Estamos para ayudarte. Contactanos por WhatsApp y respondemos lo
            antes posible.
          </p>
          <div>
            <Link
              href="https://wa.me/5493874562021"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3 rounded-xl shadow-lg transition duration-300"
            >
              <FaWhatsapp className="w-5 h-5" />
              Chatear por WhatsApp
            </Link>
          </div>
        </div>

        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src={contactImg}
            alt="Ilustración de contacto"
            className="w-full max-w-md rounded-2xl shadow-xl object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
