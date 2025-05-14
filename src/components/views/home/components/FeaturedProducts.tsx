import Image from "next/image";

export default function FeaturedProducts() {
	return (
		<div className='max-w-7xl mx-auto px-6 py-12 flex flex-col items-center'>
			<div className='mb-12 text-center'>
				<h1 className='text-4xl font-bold'>
					<span className='text-black'>Productos </span>
					<span>
						<span className='text-[var(--principal-blue)]'>
							destaca
						</span>
						<span className='text-[var(--secondary-blue)]'>
							dos
						</span>
					</span>
				</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
				<div className='border border-gray-300 rounded-md overflow-hidden'>
					<div className='relative h-64 w-full'>
						<Image
							src='https://placehold.co/200x300/000000/FFFFFF/png'
							alt='SUV'
							fill
							className='object-cover'
						/>
					</div>
					<div className='p-5'>
						<h2 className='text-xl font-medium mb-1 text-[var(--principal-blue)]'>
							SUV Familiar
						</h2>
						<p className='text-[var(--secondary-blue)] text-sm mb-3'>
							Modelo 2023
						</p>
						<p className='font-bold text-[var(--principal-blue)] text-lg mb-4'>
							$45,000
						</p>
						<button className='bg-[var(--principal-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors'>
							Comprar
						</button>
					</div>
				</div>

				<div className='border border-gray-300 rounded-md overflow-hidden'>
					<div className='relative h-64 w-full'>
						<Image
							src='https://placehold.co/200x300/000000/FFFFFF/png'
							alt='Sedán'
							fill
							className='object-cover'
						/>
					</div>
					<div className='p-5'>
						<h2 className='text-xl font-medium mb-1 text-[var(--principal-blue)]'>
							Sedán Ejecutivo
						</h2>
						<p className='text-[var(--secondary-blue)] text-sm mb-3'>
							Modelo 2023
						</p>
						<p className='font-bold text-[var(--principal-blue)] text-lg mb-4'>
							$38,500
						</p>
						<button className='bg-[var(--principal-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors'>
							Comprar
						</button>
					</div>
				</div>

				<div className='border border-gray-300 rounded-md overflow-hidden'>
					<div className='relative h-64 w-full'>
						<Image
							src='https://placehold.co/200x300/000000/FFFFFF/png'
							alt='Coupé'
							fill
							className='object-cover'
						/>
					</div>
					<div className='p-5'>
						<h2 className='text-xl font-medium mb-1 text-[var(--principal-blue)]'>
							Coupé Deportivo
						</h2>
						<p className='text-[var(--secondary-blue)] text-sm mb-3'>
							Modelo 2023
						</p>
						<p className='font-bold text-[var(--principal-blue)] text-lg mb-4'>
							$52,900
						</p>
						<button className='bg-[var(--principal-blue)] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors'>
							Comprar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
