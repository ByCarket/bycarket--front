"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
	return (
		<nav className='w-full flex items-center justify-between px-8 py-2 bg-gradient-to-r from-principal-blue to-secondary-blue'>
			<div className='flex items-center'>
				<Image
					src='/logo.jpg'
					alt='logoByCarket'
					width={60}
					height={60}
					className='object-contain'
				/>
				<span className='ml-2 text-xl font-bold text-white'>
					ByCarket
				</span>
			</div>

			<div className='hidden md:flex gap-6 text-sm text-white font-medium'>
				<Link href='/'>Home</Link>
				<Link className='ml-20' href='#'>
					Vehiculos
				</Link>
				<Link className='ml-20' href='#'>
					¿Quienes somos?
				</Link>
				<Link className='ml-20' href='#'>
					Premium
				</Link>
			</div>

			<div className='flex gap-3'>
				<Link
					href='/dashboard'
					className='rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-black hover:bg-gray-300'>
					Perfil
				</Link>
				<Link
					href='/register'
					className='rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-black hover:bg-gray-300'>
					Registrarse
				</Link>
				<Link
					href='/login'
					className='rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-black hover:bg-gray-300'>
					Iniciar Sesión
				</Link>
			</div>
		</nav>
	);
}
