export default function Sidebar() {
	return (
		<aside className='w-full md:w-64 bg-white border-r border-gray-200 p-4'>
			<div className='mb-6'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Buscar vehículos...'
						className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#103663]'
					/>
					<button className='absolute right-2 top-2 text-[#103663]'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<circle cx='11' cy='11' r='8'></circle>
							<line x1='21' y1='21' x2='16.65' y2='16.65'></line>
						</svg>
					</button>
				</div>
			</div>

			<div className='mb-6'>
				<h3 className='text-lg font-medium text-[#103663] mb-3'>
					Rango de Precio
				</h3>
				<div className='space-y-2'>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='price1'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='price1' className='text-gray-700'>
							Menos de $10,000
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='price2'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='price2' className='text-gray-700'>
							$10,000 - $20,000
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='price3'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='price3' className='text-gray-700'>
							$20,000 - $30,000
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='price4'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='price4' className='text-gray-700'>
							$30,000 - $50,000
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='price5'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='price5' className='text-gray-700'>
							Más de $50,000
						</label>
					</div>
				</div>
			</div>

			<div className='mb-6'>
				<h3 className='text-lg font-medium text-[#103663] mb-3'>
					Tipo de Vehículo
				</h3>
				<div className='space-y-2'>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='type1'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='type1' className='text-gray-700'>
							Sedán
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='type2'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='type2' className='text-gray-700'>
							SUV
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='type3'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='type3' className='text-gray-700'>
							Camioneta
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='type4'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='type4' className='text-gray-700'>
							Mate Móvil
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='type5'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='type5' className='text-gray-700'>
							Asadomóvil
						</label>
					</div>
				</div>
			</div>

			<div className='mb-6'>
				<h3 className='text-lg font-medium text-[#103663] mb-3'>
					Marca
				</h3>
				<div className='space-y-2'>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='brand1'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='brand1' className='text-gray-700'>
							Toyota
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='brand2'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='brand2' className='text-gray-700'>
							Honda
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='brand3'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='brand3' className='text-gray-700'>
							Fernet
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='brand4'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='brand4' className='text-gray-700'>
							Dulce de Leche
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='brand5'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='brand5' className='text-gray-700'>
							Messi
						</label>
					</div>
				</div>
			</div>

			<div>
				<h3 className='text-lg font-medium text-[#103663] mb-3'>Año</h3>
				<div className='space-y-2'>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='year1'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='year1' className='text-gray-700'>
							2023 - 2024
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='year2'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='year2' className='text-gray-700'>
							2020 - 2022
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='year3'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='year3' className='text-gray-700'>
							2015 - 2019
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='year4'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='year4' className='text-gray-700'>
							2010 - 2014
						</label>
					</div>
					<div className='flex items-center'>
						<input
							type='checkbox'
							id='year5'
							className='mr-2 h-4 w-4 accent-[#103663]'
						/>
						<label htmlFor='year5' className='text-gray-700'>
							Antes de 2010
						</label>
					</div>
				</div>
			</div>
		</aside>
	);
}
