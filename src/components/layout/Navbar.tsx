'use client'

import Link from 'next/link'
import Image from 'next/image'


export default function Navbar() {
    return (
        <nav className="w-full flex items-center justify-between px-8 py-2 bg-[#103663]">

            <div className="flex items-center">
                <Image
                    src="/logo.jpg"
                    alt="logoByCarket"
                    width={60}
                    height={60}
                    className="object-contain"
                />
                <span className="ml-2 text-xl font-bold text-white">ByCarket</span>
            </div>



            <div className="hidden md:flex gap-6 text-sm text-white font-medium">
                <Link href="#">Link</Link>
                <Link className='ml-20' href="#">Link</Link>
                <Link className='ml-20' href="#">Link</Link>
                <Link className='ml-20' href="#">Link</Link>
                <Link className='ml-20' href="#">Link</Link>
            </div>


            <div className="flex gap-3">
                <Link
                    href="#"
                    className="rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-black hover:bg-gray-300"
                >
                    Registrarse
                </Link>
                <Link
                    href="#"
                    className="rounded-full bg-gray-200 px-5 py-2 text-sm font-bold text-black hover:bg-gray-300"
                >
                    Iniciar Sesion
                </Link>
            </div>
        </nav>
    )
}