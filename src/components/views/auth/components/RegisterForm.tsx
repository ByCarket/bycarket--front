"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		validationSchema: Yup.object({
			firstName: Yup.string().required("El nombre es obligatorio"),
			lastName: Yup.string().required("El apellido es obligatorio"),
			email: Yup.string()
				.email("Correo electrónico inválido")
				.required("El correo electrónico es obligatorio"),
			password: Yup.string()
				.min(6, "La contraseña debe tener al menos 6 caracteres")
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]/,
					"La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
				)
				.required("La contraseña es obligatoria"),
			confirmPassword: Yup.string()
				.oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
				.required("Debes confirmar la contraseña"),
		}),
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});

	return (
		<div className='w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold text-center mb-6 text-[#103663]'>
				Registro
			</h2>

			<form onSubmit={formik.handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='firstName'
						className='block text-sm font-medium text-gray-700 mb-1'>
						Nombre
					</label>
					<input
						id='firstName'
						name='firstName'
						type='text'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.firstName}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A77A8]'
					/>
					{formik.touched.firstName && formik.errors.firstName ? (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.firstName}
						</div>
					) : null}
				</div>

				<div>
					<label
						htmlFor='lastName'
						className='block text-sm font-medium text-gray-700 mb-1'>
						Apellido
					</label>
					<input
						id='lastName'
						name='lastName'
						type='text'
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.lastName}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A77A8]'
					/>
					{formik.touched.lastName && formik.errors.lastName ? (
						<div className='text-red-500 text-sm mt-1'>
							{formik.errors.lastName}
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
					{formik.touched.password && formik.errors.password ? (
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
							type={showConfirmPassword ? "text" : "password"}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirmPassword}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A77A8]'
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
					className='w-full py-2 px-4 bg-[#103663] hover:bg-[#4A77A8] text-white font-semibold rounded-md transition duration-300'>
					Registrarse
				</button>
			</form>
		</div>
	);
}
