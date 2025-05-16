"use client";

import CompleteProfileForm from "./components/CompleteProfileForm";

export default function CompleteProfileView() {
	return (
		<div className='relative min-h-screen w-full overflow-hidden'>
			<div className='absolute top-0 left-0 w-2/3 h-full bg-principal-blue'></div>
			<div className='absolute top-0 right-0 w-1/3 h-full bg-secondary-blue'></div>

			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
				<h1 className='text-4xl md:text-5xl font-thin text-white mb-8 text-center'>
					Completa tu perfil
				</h1>
				<CompleteProfileForm />
			</div>
		</div>
	);
}
