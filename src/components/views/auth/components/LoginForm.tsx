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

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();
	const { login } = useAuth();

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.setFieldValue, setRememberMe]); //! Despues le hago un fix

	return (
		<div className='relative min-h-screen w-full overflow-hidden'>
			<div className='absolute top-0 left-0 w-2/3 h-full bg-[#103663]'></div>
			<div className='absolute top-0 right-0 w-1/3 h-full bg-[#4A77A8]'></div>

			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
				<h1 className='text-4xl md:text-5xl font-thin text-white mb-8 text-center'>
					Inicia Sesión
				</h1>

				<div className='w-full max-w-md p-6 bg-white rounded-[50px] shadow-lg'>
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
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A77A8]'
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
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A77A8]'
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
									className='h-4 w-4 text-[#103663] focus:ring-[#4A77A8] border-gray-300 rounded'
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
									className='font-medium text-[#4A77A8] hover:text-[#103663]'>
									¿Olvidaste tu contraseña?
								</a>
							</div>
						</div>

						<button
							type='submit'
							className='w-full py-2 px-4 bg-[#103663] hover:bg-[#4A77A8] text-white font-semibold rounded-md transition duration-300'>
							Iniciar Sesión
						</button>

						<div className='text-center mt-4'>
							<span className='text-sm text-gray-600'>
								¿No tienes una cuenta?{" "}
							</span>
							<a
								href='/register'
								className='text-sm font-medium text-[#4A77A8] hover:text-[#103663]'>
								Regístrate aquí
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
