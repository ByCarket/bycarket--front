"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	setRememberedEmail,
	getRememberedEmail,
	removeRememberedEmail,
} from "@/services/storage.service";
import { useAuth } from "@/hooks/useAuth";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();
	const { login } = useAuth();
	const { status } = useSession();

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleRememberMeChange = () => {
		setRememberMe(!rememberMe);
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Correo electrónico inválido")
				.required("El correo electrónico es obligatorio"),
			password: Yup.string().required("La contraseña es obligatoria"),
		}),
		onSubmit: async (values) => {
			const loginData = {
				email: values.email,
				password: values.password,
			};
			await login(loginData);

			if (rememberMe) {
				setRememberedEmail(values.email);
			} else {
				removeRememberedEmail();
			}

			router.push("/");
		},
	});

	React.useEffect(() => {
		const rememberedEmail = getRememberedEmail();
		if (rememberedEmail) {
			formik.setFieldValue("email", rememberedEmail);
			setRememberMe(true);
		}
	}, [formik.setFieldValue, setRememberMe]);

	React.useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	return (
		<div className='flex min-h-screen w-full overflow-hidden'>
			<div className='hidden md:block w-1/2 bg-gray-50'>
				<Image
					src='https://i.pinimg.com/originals/bb/87/24/bb8724a67587e50d70412c1f4841dec9.gif'
					alt='Cute GIF'
					width={0}
					height={0}
					sizes='100vw'
					className='object-cover w-full h-full'
					unoptimized={true}
					priority
				/>
			</div>
			<div className='flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8'>
				<h1 className='text-3xl md:text-4xl font-light text-principal-blue mb-6 text-center'>
					Inicia Sesión
				</h1>

				<div className='w-full max-w-md'>
					<form onSubmit={formik.handleSubmit} className='space-y-4'>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Correo Electrónico
							</label>
							<input
								id='email'
								name='email'
								type='email'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
							/>
							{formik.touched.email && formik.errors.email ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.email}
								</div>
							) : null}
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Contraseña
							</label>
							<div className='relative'>
								<input
									id='password'
									name='password'
									type={showPassword ? "text" : "password"}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.password}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
								/>
								<button
									type='button'
									onClick={togglePasswordVisibility}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									{showPassword ? (
										<EyeOff className='h-5 w-5 text-gray-500' />
									) : (
										<Eye className='h-5 w-5 text-gray-500' />
									)}
								</button>
							</div>
							{formik.touched.password &&
							formik.errors.password ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.password}
								</div>
							) : null}
						</div>

						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<input
									id='remember'
									name='remember'
									type='checkbox'
									checked={rememberMe}
									onChange={handleRememberMeChange}
									className='h-4 w-4 text-principal-blue focus:ring-secondary-blue border-gray-300 rounded'
								/>
								<label
									htmlFor='remember'
									className='ml-2 block text-sm text-gray-700'>
									Recordarme
								</label>
							</div>
							<div className='text-sm'>
								<a
									href='/forgot-password'
									className='font-medium text-secondary-blue hover:text-principal-blue'>
									¿Olvidaste tu contraseña?
								</a>
							</div>
						</div>

						<button
							type='submit'
							className='w-full py-2 px-4 bg-principal-blue hover:bg-secondary-blue text-white font-semibold rounded-md transition duration-300'>
							Iniciar Sesión
						</button>

						<div className='text-center mt-4'>
							<span className='text-sm text-gray-600'>
								prefieres iniciar sesion con:
							</span>
						</div>

						<div className='text-center mt-2'>
							<button
								type='button'
								onClick={() => signIn("google", { callbackUrl: "/" })}
								className='w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-300 mx-auto'>
								<FcGoogle className='h-6 w-6' />
							</button>
						</div>

						<div className='text-center mt-4'>
							<span className='text-sm text-gray-600'>
								¿No tienes una cuenta?{" "}
							</span>
							<a
								href='/register'
								className='text-sm font-medium text-secondary-blue hover:text-principal-blue'>
								Regístrate aquí
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
