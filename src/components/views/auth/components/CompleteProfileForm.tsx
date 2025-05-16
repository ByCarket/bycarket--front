"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { completeGoogleProfile } from "@/services/api.service";

export default function CompleteProfileForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	const formik = useFormik({
		initialValues: {
			phone: undefined as number | undefined,
			country: "",
			city: "",
			address: "",
		},
		validationSchema: Yup.object({
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
			if (!email) {
				console.error("No se encontró un email en los param")
				return;
			}
			const profileData = {
				email: email,
				phone: values.phone ?? undefined,
				country: values.country,
				city: values.city,
				address: values.address,
			};
			try {
				await completeGoogleProfile(profileData);
				router.push("/");
			} catch (error) {
				console.error("Error completing profile:", error);
			}
		},
	});

	return (
		<div className='w-full max-w-md p-6 bg-white rounded-[50px] shadow-lg'>
			<form onSubmit={formik.handleSubmit} className='space-y-4'>
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
						{formik.touched.country && formik.errors.country ? (
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

				<button
					type='submit'
					className='w-full py-2 px-4 bg-principal-blue hover:bg-secondary-blue text-white font-semibold rounded-md transition duration-300'>
					Completar Perfil
				</button>
			</form>
		</div>
	);
}
