"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const router = useRouter();
	const { register } = useAuth();

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			phone: undefined as number | undefined,
			country: "",
			city: "",
			address: "",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("El nombre completo es obligatorio"),
			email: Yup.string()
				.email("Correo electrónico inválido")
				.required("El correo electrónico es obligatorio"),
			password: Yup.string()
				.min(6, "La contraseña debe tener al menos 6 caracteres")
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d@$!%*?&.]/,
					"La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
				)
				.required("La contraseña es obligatoria"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
				.required("Debes confirmar la contraseña"),
			phone: Yup.number()
				.nullable()
				.transform((value, originalValue) =>
					originalValue === "" ? null : value
				)
				.typeError("El teléfono debe ser un número válido"),
			country: Yup.string(),
			city: Yup.string(),
			address: Yup.string(),
		}),
		onSubmit: async (values) => {
			const registrationData = {
				name: values.name,
				email: values.email,
				password: values.password,
				confirmPassword: values.confirmPassword,
				phone: values.phone ?? undefined,
				country: values.country,
				city: values.city,
				address: values.address,
			};
			await register(registrationData);
			router.push("/login");
		},
	});

	return (
		<div className='relative min-h-screen w-full overflow-hidden'>
			<div className='absolute top-0 left-0 w-3/4 h-1/2 bg-principal-blue rounded-br-[100px]'></div>
			<div className='absolute bottom-0 right-0 w-3/4 h-1/3 bg-secondary-blue rounded-tl-[100px]'></div>

			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4'>
				<h1 className='text-4xl md:text-5xl font-thin text-white mb-8 text-center'>
					Registra tu cuenta
				</h1>

				<div className='w-full max-w-md p-6 bg-white rounded-[50px] shadow-lg'>
					<form onSubmit={formik.handleSubmit} className='space-y-4'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Nombre Completo
							</label>
							<input
								id='name'
								name='name'
								type='text'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.name}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
							/>
							{formik.touched.name && formik.errors.name ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.name}
								</div>
							) : null}
						</div>

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
								htmlFor='phone'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Teléfono
							</label>
							<input
								id='phone'
								name='phone'
								type='number'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.phone ?? ""}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
							/>
							{formik.touched.phone && formik.errors.phone ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.phone}
								</div>
							) : null}
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label
									htmlFor='country'
									className='block text-sm font-medium text-gray-700 mb-1'>
									País
								</label>
								<input
									id='country'
									name='country'
									type='text'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.country}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
								/>
								{formik.touched.country &&
								formik.errors.country ? (
									<div className='text-red-500 text-sm mt-1'>
										{formik.errors.country}
									</div>
								) : null}
							</div>

							<div>
								<label
									htmlFor='city'
									className='block text-sm font-medium text-gray-700 mb-1'>
									Ciudad
								</label>
								<input
									id='city'
									name='city'
									type='text'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.city}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
								/>
								{formik.touched.city && formik.errors.city ? (
									<div className='text-red-500 text-sm mt-1'>
										{formik.errors.city}
									</div>
								) : null}
							</div>
						</div>

						<div>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Dirección
							</label>
							<input
								id='address'
								name='address'
								type='text'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.address}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
							/>
							{formik.touched.address && formik.errors.address ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.address}
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

						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-700 mb-1'>
								Confirmar Contraseña
							</label>
							<div className='relative'>
								<input
									id='confirmPassword'
									name='confirmPassword'
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.confirmPassword}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue'
								/>
								<button
									type='button'
									onClick={toggleConfirmPasswordVisibility}
									className='absolute inset-y-0 right-0 pr-3 flex items-center'>
									{showConfirmPassword ? (
										<EyeOff className='h-5 w-5 text-gray-500' />
									) : (
										<Eye className='h-5 w-5 text-gray-500' />
									)}
								</button>
							</div>
							{formik.touched.confirmPassword &&
							formik.errors.confirmPassword ? (
								<div className='text-red-500 text-sm mt-1'>
									{formik.errors.confirmPassword}
								</div>
							) : null}
						</div>

						<button
							type='submit'
							className='w-full py-2 px-4 bg-principal-blue hover:bg-secondary-blue text-white font-semibold rounded-md transition duration-300'>
							Registrarse
						</button>

						<div className='text-center mt-4'>
							<span className='text-gray-600'>
								¿Tienes cuenta?{" "}
							</span>
							<a
								href='/login'
								className='text-principal-blue hover:text-secondary-blue font-medium transition duration-300'>
								Inicia sesión
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
