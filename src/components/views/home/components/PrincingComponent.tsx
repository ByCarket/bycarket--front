import Image from "next/image";

export default function PrincingComponent() {
	return (
		<div className='w-full py-12 px-4 md:px-6'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
				<div className='bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full'>
					<div className='mb-4'>
						<div className='w-12 h-12 bg-[var(--principal-blue)] rounded-full flex items-center justify-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'></path>
								<polyline points='14 2 14 8 20 8'></polyline>
								<path d='M12 18v-6'></path>
								<path d='m9 15 3 3 3-3'></path>
							</svg>
						</div>
					</div>
					<h2 className='text-2xl font-bold text-[var(--principal-blue)] mb-3'>
						Vende tu vehículo
					</h2>
					<p className='text-[var(--secondary-blue)] mb-6 flex-grow'>
						Publica tu vehículo de forma rápida y segura. Llega a
						miles de compradores potenciales en nuestra plataforma.
					</p>
					<div className='relative h-40 w-full mb-6'>
						<Image
							src='https://placehold.co/600x400/000000/FFFFFF/png'
							alt='Vender vehículo'
							fill
							className='object-cover rounded-lg'
						/>
					</div>
					<button className='bg-[var(--principal-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors mt-auto self-start'>
						Publicar ahora
					</button>
				</div>

				<div className='bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full'>
					<div className='mb-4'>
						<div className='w-12 h-12 bg-[var(--secondary-blue)] rounded-full flex items-center justify-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<path d='M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'></path>
								<path d='M12 8v1'></path>
								<path d='M12 15v1'></path>
								<path d='M16 12h-1'></path>
								<path d='M9 12H8'></path>
								<path d='M15.7 9.7l-.7.7'></path>
								<path d='M9.7 9.7l-.7-.7'></path>
								<path d='M15.7 14.3l-.7-.7'></path>
								<path d='M9.7 14.3l-.7.7'></path>
							</svg>
						</div>
					</div>
					<h2 className='text-2xl font-bold text-[var(--principal-blue)] mb-3'>
						Suscripción Premium
					</h2>
					<p className='text-[var(--secondary-blue)] mb-6 flex-grow'>
						Genera contenido con IA para tus publicaciones. Destaca
						entre la competencia con descripciones profesionales y
						atractivas.
					</p>
					<div className='relative h-40 w-full mb-6'>
						<Image
							src='https://placehold.co/600x400/000000/FFFFFF/png'
							alt='Suscripción Premium'
							fill
							className='object-cover rounded-lg'
						/>
					</div>
					<button className='bg-[var(--secondary-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors mt-auto self-start'>
						Suscribirse
					</button>
				</div>

				<div className='bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full'>
					<div className='mb-4'>
						<div className='w-12 h-12 bg-[var(--principal-blue)] rounded-full flex items-center justify-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='white'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<circle cx='8' cy='21' r='1'></circle>
								<circle cx='19' cy='21' r='1'></circle>
								<path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'></path>
							</svg>
						</div>
					</div>
					<h2 className='text-2xl font-bold text-[var(--principal-blue)] mb-3'>
						Compra un vehículo
					</h2>
					<p className='text-[var(--secondary-blue)] mb-6 flex-grow'>
						Encuentra el vehículo perfecto para ti. Filtra por
						marca, modelo, año y más para encontrar exactamente lo
						que buscas.
					</p>
					<div className='relative h-40 w-full mb-6'>
						<Image
							src='https://placehold.co/600x400/000000/FFFFFF/png'
							alt='Comprar vehículo'
							fill
							className='object-cover rounded-lg'
						/>
					</div>
					<button className='bg-[var(--principal-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors mt-auto self-start'>
						Explorar ahora
					</button>
				</div>
			</div>
		</div>
	);
}
