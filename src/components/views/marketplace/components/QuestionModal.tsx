"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { showSuccess } from "@/app/utils/Notifications";

const QuestionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    showSuccess("Tu pregunta ha sido enviada con éxito.");
    setIsOpen(false);
    setQuestion("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2
                           bg-principal-blue text-white px-6 py-3 rounded-lg font-semibold shadow-md
                           hover:bg-secondary-blue transition duration-300 ease-in-out
                           border-l-4 border-r-4 border-principal-blue"
      >
        <HiOutlineChatBubbleLeftRight size={20} />
        Contactar vendedor
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
          <Dialog.Panel
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8
                                              transform transition-all duration-300 ease-out
                                              data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-2xl font-bold text-principal-blue">
                Hacer una pregunta
              </Dialog.Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <IoClose size={28} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribí tu consulta sobre el vehículo (ej. ¿Cuál es el consumo de combustible?, ¿Se aceptan permutas?)."
                className="w-full h-36 border border-gray-300 rounded-lg p-3 text-base resize-y
                                           focus:outline-none focus:border-principal-blue focus:ring-2 focus:ring-principal-blue/50
                                           transition-all duration-200 ease-in-out"
                required
              />

              {/* Botón de envío */}
              <button
                type="submit"
                className="mt-6 w-full bg-principal-blue text-white py-3 rounded-lg font-semibold shadow-md
                                           hover:bg-secondary-blue transition duration-300 ease-in-out"
              >
                Enviar pregunta
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default QuestionModal;
