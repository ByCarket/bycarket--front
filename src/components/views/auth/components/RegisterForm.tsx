"use client";

import React, { useState, useEffect } from "react";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

import { useSession } from "next-auth/react";
import notify from "@/app/utils/Notifications";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number | undefined;
  country: string;
  city: string;
  address: string;
}

const InputField = ({
  id,
  label,
  type = "text",
  formik,
  ...props
}: {
  id: keyof FormValues;
  label: string;
  type?: string;
  formik: FormikProps<FormValues>;
  [key: string]: unknown;
}) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[id] ?? ""}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
      {...props}
    />
    {formik.touched[id] && formik.errors[id] ? (
      <div className="text-red-500 text-xs mt-1">
        {formik.errors[id]?.toString()}
      </div>
    ) : null}
  </div>
);

const PasswordField = ({
  id,
  label,
  formik,
  showPassword,
  showConfirmPassword,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
}: {
  id: "password" | "confirmPassword";
  label: string;
  formik: FormikProps<FormValues>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
}) => {
  const isConfirm = id === "confirmPassword";
  const showPwd = isConfirm ? showConfirmPassword : showPassword;
  const toggleFn = isConfirm
    ? toggleConfirmPasswordVisibility
    : togglePasswordVisibility;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={showPwd ? "text" : "password"}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[id]}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-blue"
        />
        <button
          type="button"
          onClick={toggleFn}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPwd ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      {formik.touched[id] && formik.errors[id] ? (
        <div className="text-red-500 text-xs mt-1">
          {formik.errors[id]?.toString()}
        </div>
      ) : null}
    </div>
  );
};

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: number;
  country: string;
  city: string;
  address: string;
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register } = useAuth();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: undefined,
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
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(15, "La contraseña no debe exceder los 15 caracteres")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/,
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&.), y tener entre 8 y 15 caracteres"
        )
        .required("La contraseña es obligatoria"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Debes confirmar la contraseña"),
      phone: Yup.number()
        .required("El teléfono es obligatorio")
        .typeError("El teléfono debe ser un número válido"),
      country: Yup.string().required("El país es obligatorio"),
      city: Yup.string().required("La ciudad es obligatoria"),
      address: Yup.string().required("La dirección es obligatoria"),
    }),
    onSubmit: async (values) => {
      setError(null);
      const registrationData: RegistrationData = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone as number,
        country: values.country,
        city: values.city,
        address: values.address,
      };
      try {
        await register(registrationData);
        notify.success(
          "¡Registro exitoso!",
          "Tu cuenta ha sido creada correctamente. Por favor inicia sesión."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          "Error en el registro. Por favor, verifica los datos e inténtalo de nuevo.";
        notify.error("Error en el registro", errorMessage);

        if (err?.response?.data?.field) {
          formik.setFieldError(
            err.response.data.field,
            err.response.data.message
          );
        } else if (err instanceof Error) {
          setError(errorMessage);
        } else {
          setError("Error en el registro. Inténtalo de nuevo.");
        }
      }
    },
  });

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-light text-principal-blue mb-6 text-center">
          Registra tu cuenta
        </h1>

        <div className="w-full max-w-md">
          <form onSubmit={formik.handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 gap-4">
              <InputField id="name" label="Nombre Completo" formik={formik} />
              <InputField
                id="email"
                label="Correo Electrónico"
                type="email"
                formik={formik}
              />
              <InputField
                id="phone"
                label="Teléfono"
                type="number"
                formik={formik}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField id="country" label="País" formik={formik} />
                <InputField id="city" label="Ciudad" formik={formik} />
              </div>

              <InputField id="address" label="Dirección" formik={formik} />
              <PasswordField
                id="password"
                label="Contraseña"
                formik={formik}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                toggleConfirmPasswordVisibility={
                  toggleConfirmPasswordVisibility
                }
              />
              <PasswordField
                id="confirmPassword"
                label="Confirmar Contraseña"
                formik={formik}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                toggleConfirmPasswordVisibility={
                  toggleConfirmPasswordVisibility
                }
              />
            </div>

            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

            <button
              type="submit"
              className="w-full py-2 px-4 mt-4 bg-principal-blue hover:bg-secondary-blue text-white font-medium rounded-md transition duration-300"
            >
              Registrarse
            </button>

            <div className="flex flex-col items-center mt-4 space-y-4">
              <div className="flex items-center w-full">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="px-3 text-xs text-gray-500">
                  o regístrate con
                </span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition duration-300"
              >
                <FcGoogle className="h-5 w-5" />
              </button>

              <div className="text-center text-sm">
                <span className="text-gray-600">¿Tienes cuenta? </span>
                <a
                  href="/login"
                  className="text-principal-blue hover:text-secondary-blue font-medium transition duration-300"
                >
                  Inicia sesión
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-50">
        <Image
          src="https://i.pinimg.com/originals/bb/87/24/bb8724a67587e50d70412c1f4841dec9.gif"
          alt="Cute GIF"
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover w-full h-full"
          unoptimized={true}
          priority
        />
      </div>
    </div>
  );
}
