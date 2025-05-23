"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

const QuestionModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [question, setQuestion] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		alert(`Pregunta enviada: ${question}`);
		setIsOpen(false);
		setQuestion("");
	};

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				<HiOutlineChatBubbleLeftRight size={18} />
				Preguntar
			</button>

			<Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
				<div className="fixed inset-0 bg-black/30" aria-hidden="true" />

				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl p-6">
						<div className="flex justify-between items-center mb-4">
							<Dialog.Title className="text-lg font-semibold text-gray-800">Hacer una pregunta</Dialog.Title>
							<button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
								<IoClose size={24} />
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							<textarea
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								placeholder="Escribí tu consulta sobre el vehículo..."
								className="w-full h-32 border border-gray-300 rounded p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>

							<button
								type="submit"
								className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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
