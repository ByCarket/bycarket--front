"use client";

import { useState } from "react";
import { useUserData } from "@/hooks/useUserData";
import { UpdateUserData } from "@/services/api.service";

export default function UserData() {
	const { userData, loading, error, updating, updateUser, refetch } =
		useUserData();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<UpdateUserData>({});
	const [updateMessage, setUpdateMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-[300px]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-50 border border-red-200 rounded-lg p-4 my-4'>
				<p className='text-red-600'>{error}</p>
			</div>
		);
	}

	if (!userData) {
		return (
			<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4'>
				<p className='text-yellow-600'>
					No hay datos de usuario disponibles
				</p>
			</div>
		);
	}

	const formatPhoneNumber = (phone?: number) => {
		if (!phone) return "No especificado";
		const phoneStr = phone.toString();
		if (phoneStr.length === 10) {
			return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
				3,
				6
			)}-${phoneStr.slice(6)}`;
		}
		return phoneStr;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "phone") {
			setFormData({
				...formData,
				[name]: value === "" ? undefined : Number(value),
			} as UpdateUserData);
		} else {
			setFormData({
				...formData,
				[name]: value,
			} as UpdateUserData);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = await updateUser(formData);

		if (result?.success) {
			setUpdateMessage({
				type: "success",
				text: "Datos actualizados correctamente",
			});
			setIsEditing(false);
			setFormData({});
			refetch();
		} else {
			setUpdateMessage({
				type: "error",
				text: result?.error || "Error al actualizar datos",
			});
		}

		setTimeout(() => {
			setUpdateMessage(null);
		}, 3000);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFormData({});
	};

	return (
		<div className='bg-white shadow-md rounded-lg overflow-hidden'>
			<div className='bg-principal-blue text-white p-6 flex justify-between items-center'>
				<div>
					<h2 className='text-2xl font-bold'>{userData.name}</h2>
					<p className='text-blue-100'>
						{userData.role || "Usuario"}
					</p>
				</div>
				{!isEditing && (
					<button
						onClick={() => {
							setIsEditing(true);
							setFormData({
								phone: userData.phone,
								country: userData.country,
								city: userData.city,
								address: userData.address,
							});
						}}
						className='px-4 py-2 bg-white text-principal-blue rounded-md hover:bg-blue-50 transition-colors'>
						Editar Perfil
					</button>
				)}
			</div>

			{updateMessage && (
				<div
					className={`p-3 ${
						updateMessage.type === "success"
							? "bg-green-50 text-green-700 border-green-200"
							: "bg-red-50 text-red-700 border-red-200"
					} border rounded-md mx-6 mt-4`}>
					{updateMessage.text}
				</div>
			)}

			<div className='p-6'>
				{isEditing ? (
					<form onSubmit={handleSubmit}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Información Personal
								</h3>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Nombre
										</label>
										<p className='font-medium p-2 bg-gray-50 rounded-md'>
											{userData.name}
										</p>
									</div>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Email
										</label>
										<p className='font-medium p-2 bg-gray-50 rounded-md'>
											{userData.email}
										</p>
									</div>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Teléfono
										</label>
										<input
											type='number'
											name='phone'
											value={formData.phone || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Ubicación
								</h3>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											País
										</label>
										<input
											type='text'
											name='country'
											value={formData.country || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Ciudad
										</label>
										<input
											type='text'
											name='city'
											value={formData.city || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>
									<div>
										<label className='block text-sm text-gray-500 mb-1'>
											Dirección
										</label>
										<input
											type='text'
											name='address'
											value={formData.address || ""}
											onChange={handleInputChange}
											className='w-full p-2 border border-gray-300 rounded-md'
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='mt-6 flex justify-end space-x-3'>
							<button
								type='button'
								onClick={handleCancel}
								className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
								Cancelar
							</button>
							<button
								type='submit'
								disabled={updating}
								className='px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70'>
								{updating
									? "Actualizando..."
									: "Guardar Cambios"}
							</button>
						</div>
					</form>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Información Personal
								</h3>
								<div className='space-y-3'>
									<div>
										<p className='text-sm text-gray-500'>
											Email
										</p>
										<p className='font-medium'>
											{userData.email}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-500'>
											Teléfono
										</p>
										<p className='font-medium'>
											{formatPhoneNumber(userData.phone)}
										</p>
									</div>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Ubicación
								</h3>
								<div className='space-y-3'>
									<div>
										<p className='text-sm text-gray-500'>
											País
										</p>
										<p className='font-medium'>
											{userData.country ||
												"No especificado"}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-500'>
											Ciudad
										</p>
										<p className='font-medium'>
											{userData.city || "No especificado"}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-500'>
											Dirección
										</p>
										<p className='font-medium'>
											{userData.address ||
												"No especificado"}
										</p>
									</div>
								</div>
							</div>
						</div>

						{userData.posts && userData.posts.length > 0 && (
							<div className='mt-8'>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Mis Publicaciones
								</h3>
								<div className='space-y-4'>
									{userData.posts.map((post) => (
										<div
											key={post.id}
											className='border border-gray-200 rounded-lg p-4'>
											<div className='flex justify-between items-center'>
												<p className='font-medium'>
													Publicación #
													{post.id.slice(-5)}
												</p>
												<span
													className={`px-2 py-1 text-xs rounded-full ${
														post.status === "active"
															? "bg-green-100 text-green-800"
															: post.status ===
															  "pending"
															? "bg-yellow-100 text-yellow-800"
															: "bg-gray-100 text-gray-800"
													}`}>
													{post.status === "active"
														? "Activa"
														: post.status ===
														  "pending"
														? "Pendiente"
														: post.status}
												</span>
											</div>
											<p className='text-sm text-gray-500 mt-1'>
												Fecha:{" "}
												{new Date(
													post.postDate
												).toLocaleDateString()}
											</p>

											{post.questions &&
												post.questions.length > 0 && (
													<div className='mt-3'>
														<p className='text-sm font-medium text-gray-700'>
															Preguntas (
															{
																post.questions
																	.length
															}
															)
														</p>
														<div className='mt-2 max-h-32 overflow-y-auto'>
															{post.questions.map(
																(question) => (
																	<div
																		key={
																			question.id
																		}
																		className='bg-gray-50 p-2 rounded my-1 text-sm'>
																		<p>
																			{
																				question.message
																			}
																		</p>
																		<p className='text-xs text-gray-500 mt-1'>
																			{new Date(
																				question.date
																			).toLocaleDateString()}
																		</p>
																	</div>
																)
															)}
														</div>
													</div>
												)}
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
