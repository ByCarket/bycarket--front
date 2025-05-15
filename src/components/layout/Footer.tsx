"use client";

import type React from "react";

import { useState } from "react";

export default function Footer() {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert(`Gracias por suscribirte con: ${email}`);
		setEmail(""); // * Aca va la logica de la sub de email, proximamente
	};

	return (
		<footer className='w-full h-[60vh] bg-gradient-to-r from-principal-blue to-secondary-blue'>
			<div className='container mx-auto h-full flex flex-col'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 flex-grow'>
					<div className='flex flex-col'>
						<h3 className='text-xl font-medium mb-4 text-white'>
							ByCarket
						</h3>
						<p className='text-gray-300 mb-4'>
							Ofrecemos productos de alta calidad con diseños
							únicos y sostenibles para tu hogar y estilo de vida.
						</p>
					</div>

					<div className='flex flex-col'>
						<h3 className='text-xl font-medium mb-4 pb-1 border-b border-white text-white'>
							Categorías
						</h3>
						<div className='flex flex-col space-y-2 text-gray-300'>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								SUV
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Ferrari
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Camioneta
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Papas fritas
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Mate dulce o amargo
							</a>
						</div>
					</div>

					<div className='flex flex-col'>
						<h3 className='text-xl font-medium mb-4 pb-1 border-b border-white text-white'>
							Enlaces Rápidos
						</h3>
						<div className='flex flex-col space-y-2 text-gray-300'>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Sobre Nosotros
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Política de Privacidad
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Términos y Condiciones
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								FAQ
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Blog
							</a>
						</div>
					</div>

					<div className='flex flex-col'>
						<h3 className='text-xl font-medium mb-4 pb-1 border-b border-white text-white'>
							Contacto
						</h3>
						<div className='flex flex-col space-y-2 text-gray-300'>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								info@bycarket.com
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								+54 1167672197
							</a>
							<a
								href='#'
								className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
								Hola Mundo, Busco empleo
							</a>
							<div className='flex space-x-4 mt-2'>
								<a
									href='#'
									className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
									Instagram
								</a>
								<a
									href='#'
									className='hover:text-white/80 transition-transform hover:translate-x-1 hover:border-l-2 hover:border-white pl-2'>
									Facebook
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Sección de ofertas */}
				<div className='py-8 border-t border-gray-200'>
					<div className='max-w-md mx-auto text-center'>
						<h4 className='text-lg font-medium mb-3 text-white'>
							Recibe nuestras ofertas
						</h4>
						<p className='text-gray-300 mb-4'>
							Suscríbete para recibir las últimas novedades y
							ofertas exclusivas.
						</p>
						<form
							onSubmit={handleSubmit}
							className='flex flex-col sm:flex-row gap-2'>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Tu correo electrónico'
								className='flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white text-gray-600 placeholder-gray-500'
								required
							/>
							<button
								type='submit'
								className='px-6 py-2 bg-principal-blue text-white rounded-md hover:bg-principal-blue/80 transition-colors'>
								Suscribirse
							</button>
						</form>
					</div>
				</div>

				<div className='py-4 text-center text-white text-sm border-t border-gray-200'>
					<p>
						&copy; {new Date().getFullYear()} ByCarket. Todos los
						derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
