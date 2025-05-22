"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserVehicles, VehicleResponse } from "@/services/vehicle.service";
import { createPost } from "@/services/api.service";
import { useRouter } from "next/navigation";

interface PublishVehicleFormProps {
	onSuccess?: () => void;
}

const PublishVehicleForm: React.FC<PublishVehicleFormProps> = ({ onSuccess }) => {
	const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchVehicles = async () => {
			setLoading(true);
			try {
				const userVehicles = await getUserVehicles();
				setVehicles(userVehicles);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicles();
	}, []);

	const validationSchema = Yup.object({
		vehicleId: Yup.string().required("Debes seleccionar un vehículo"),
		description: Yup.string().max(500, "La descripción no puede exceder los 500 caracteres"),
	});

	const formik = useFormik({
		initialValues: {
			vehicleId: "",
			description: "",
		},
		validationSchema,
		onSubmit: async (values) => {
			setLoading(true);
			try {
				console.log(`Intentando publicar vehículo desde formulario - Datos: { vehicleId: "${values.vehicleId}", description: "${values.description}", vehicleSeleccionado: ${vehicles.find(v => v.id === values.vehicleId)?.brand.name || 'No encontrado'} ${vehicles.find(v => v.id === values.vehicleId)?.model.name || ''} }`);
				
				await createPost(values.vehicleId, values.description);
				setSuccess(true);
				if (onSuccess) {
					onSuccess();
				} else {
					router.push("/dashboard?tab=publications");
				}
			} finally {
				setLoading(false);
			}
		},
	});

	if (vehicles.length === 0 && !loading) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
				<h2 className="text-xl font-semibold text-yellow-700 mb-2">No tienes vehículos registrados</h2>
				<p className="text-yellow-600 mb-4">Debes registrar un vehículo antes de poder publicarlo.</p>
				<button
					onClick={() => router.push("/dashboard?tab=register-vehicle")}
					className="px-4 py-2 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300"
				>
					Registrar un vehículo
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<h1 className="text-2xl font-light text-principal-blue mb-6 text-center">
				Publicar Vehículo
			</h1>

			{success && (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
					¡Vehículo publicado exitosamente!
				</div>
			)}

			<form onSubmit={formik.handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="vehicleId"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Selecciona un vehículo
					</label>
					<select
						id="vehicleId"
						name="vehicleId"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.vehicleId}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
					>
						<option value="">Selecciona un vehículo</option>
						{vehicles.map((vehicle) => (
							<option key={vehicle.id} value={vehicle.id}>
								{vehicle.brand.name} {vehicle.model.name} {vehicle.version.name} ({vehicle.year})
							</option>
						))}
					</select>
					{formik.touched.vehicleId && formik.errors.vehicleId ? (
						<div className="text-red-500 text-xs mt-1">
							{formik.errors.vehicleId}
						</div>
					) : null}
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Descripción de la publicación (opcional)
					</label>
					<textarea
						id="description"
						name="description"
						rows={4}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.description}
						placeholder="Añade detalles adicionales para tu publicación..."
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
					/>
					{formik.touched.description && formik.errors.description ? (
						<div className="text-red-500 text-xs mt-1">
							{formik.errors.description}
						</div>
					) : null}
				</div>

				<div className="flex justify-end">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300 disabled:opacity-50"
					>
						{loading ? "Publicando..." : "Publicar Vehículo"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default PublishVehicleForm;
