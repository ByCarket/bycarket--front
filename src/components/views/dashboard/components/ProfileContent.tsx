"use client";

import { useState, useRef } from "react";
import { useUserData } from "@/hooks/useUserData";
import { UpdateUserData } from "@/services/api.service";
import { FaTrash, FaEdit, FaPen } from "react-icons/fa";
import { Modal } from "@/components/ui/Modal";
import Image from "next/image";

export default function ProfileContent() {
  const {
    userData,
    loading,
    error,
    updating,
    deleting,
    updateUser,
    deleteAccount,
    refetch,
    uploadProfileImage,
  } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-principal-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
        <p className="text-yellow-600">No hay datos de usuario disponibles</p>
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

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (!result?.success) {
      setUpdateMessage({
        type: "error",
        text: result?.error || "Error al eliminar la cuenta",
      });
      setIsDeleteModalOpen(false);

      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setUpdateMessage({
        type: "error",
        text: "La imagen no debe superar los 1MB",
      });
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadProfileImage(file);
      if (result?.success) {
        setUpdateMessage({
          type: "success",
          text: "Imagen de perfil actualizada correctamente",
        });
        refetch();
      } else {
        setUpdateMessage({
          type: "error",
          text: result?.error || "Error al actualizar la imagen",
        });
      }
    } catch (error) {
      setUpdateMessage({
        type: "error",
        text: "Error al subir la imagen",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-2xl mt-8">
        {updateMessage && (
          <div
            className={`mb-6 p-4 ${
              updateMessage.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            } border rounded-md`}
          >
            {updateMessage.text}
          </div>
        )}

        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Perfil público</h1>
        </div>

        <div className="flex flex-col p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
                Foto de perfil
              </h2>
              <div className="relative flex justify-center mb-6">
                {userData.image ? (
                  <div
                    className="relative w-60 h-60 rounded-full overflow-hidden cursor-pointer border border-gray-200"
                    onClick={handleImageClick}
                  >
                    <Image
                      src={userData.image}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="relative w-60 h-60 rounded-full bg-secondary-blue flex items-center justify-center text-white text-5xl font-bold cursor-pointer border border-gray-200"
                    onClick={handleImageClick}
                  >
                    {getInitials(userData.name)}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-2 right-2 bg-gray-800 text-white rounded-md p-2 hover:bg-gray-700 transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex flex-col gap-3 mb-6">
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
                  className="px-5 py-3 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors font-medium flex items-center justify-center gap-2 shadow-sm text-base"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Editar perfil</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-5 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm text-base"
                >
                  <FaTrash className="w-5 h-5" />
                  <span>Eliminar cuenta</span>
                </button>
              </div>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Nombre
                      </h2>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || userData.name || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Tu nombre puede aparecer en tus publicaciones o
                        anuncios.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Email público
                      </h2>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || userData.email || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Tu email es privado.
                      </p>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Teléfono
                      </h2>
                      <input
                        type="number"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        País
                      </h2>
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Ciudad
                      </h2>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-gray-700 mb-2">
                        Dirección
                      </h2>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md text-base"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium text-base"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-5 py-3 bg-principal-blue text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70 font-medium flex items-center gap-2 text-base"
                      >
                        {updating ? "Actualizando..." : "Guardar Cambios"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Nombre
                    </h2>
                    <div>
                      <p className="text-lg">{userData.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Tu nombre puede aparecer en tus publicaciones o
                        anuncios.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Email público
                    </h2>
                    <div>
                      <p className="text-lg">{userData.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Tu email es privado.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Teléfono
                    </h2>
                    <p className="text-lg">
                      {formatPhoneNumber(userData.phone)}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      País
                    </h2>
                    <p className="text-lg">
                      {userData.country || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Ciudad
                    </h2>
                    <p className="text-lg">
                      {userData.city || "No especificado"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-2">
                      Dirección
                    </h2>
                    <p className="text-lg">
                      {userData.address || "No especificado"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Eliminar cuenta"
      >
        <div className="p-4">
          <p className="mb-4 text-gray-700">
            ¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede
            deshacer.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4" />
                  <span>Eliminar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
