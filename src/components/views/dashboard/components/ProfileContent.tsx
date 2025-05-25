"use client";

import { useState, useRef } from "react";
import { useUserData } from "@/hooks/useUserData";
import { UpdateUserData } from "@/services/api.service";
import { Trash, Edit } from "lucide-react";
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
    <div>
      <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg mt-8">
        <div className="flex flex-col md:flex-row gap-0 md:gap-8">
          <div className="flex flex-col items-center md:items-start md:w-1/3 p-8 pt-10 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative mb-4">
              {userData.image ? (
                <div
                  className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
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
                  className="w-24 h-24 rounded-full bg-secondary-blue flex items-center justify-center text-white text-3xl font-bold cursor-pointer"
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
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                <Edit className="w-4 h-4 text-principal-blue" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
              />
            </div>
            <h2 className="text-xl font-bold text-center">{userData.name}</h2>
            <p className="text-gray-500 text-center mb-4">{userData.email}</p>
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
              className="w-full py-2 bg-principal-blue text-white rounded-md hover:bg-secondary-blue transition-colors mb-2"
            >
              Editar perfil
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash className="w-4 h-4" />
              <span>Eliminar cuenta</span>
            </button>
          </div>

          <div className="flex-1 p-8">
            {updateMessage && (
              <div
                className={`mb-6 p-3 ${
                  updateMessage.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                } border rounded-md`}
              >
                {updateMessage.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-principal-blue text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70"
                  >
                    {updating ? "Actualizando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                  <p className="font-medium">
                    {formatPhoneNumber(userData.phone)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">País</p>
                  <p className="font-medium">
                    {userData.country || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ciudad</p>
                  <p className="font-medium">
                    {userData.city || "No especificado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dirección</p>
                  <p className="font-medium">
                    {userData.address || "No especificado"}
                  </p>
                </div>
              </div>
            )}
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
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4" />
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
