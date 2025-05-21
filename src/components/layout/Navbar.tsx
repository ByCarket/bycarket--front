"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const { status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated || status === "authenticated");
  }, [isAuthenticated, status]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="relative py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link
          href="/home"
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/logoo.png"
            alt="logoByCarket"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold text-principal-blue">
            ByCarket
          </span>
        </Link>

        <div className="hidden space-x-6 md:flex ">
          <Link
            href="/home"
            className={`relative transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-principal-blue ${pathname === "/home"
              ? "text-principal-blue after:w-full"
              : "text-principal-blue after:w-0 hover:after:w-full"
              }`}
          >
            Inicio
          </Link>

          <Link
            href="/marketplace"
            className={`relative transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-principal-blue ${pathname === "/marketplace"
              ? "text-principal-blue  after:w-full"
              : "text-principal-blue  after:w-0 hover:after:w-full"
              }`}
          >
            Vehiculos
          </Link>

          <Link
            href="/suscription"
            className={`relative transition-all duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-principal-blue ${pathname === "/suscription"
              ? "text-principal-blue  after:w-full"
              : "text-principal-blue  after:w-0 hover:after:w-full"
              }`}
          >
            Premium
          </Link>
        </div>

        <div className="hidden space-x-2 md:flex">
          {isUserAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md bg-principal-blue px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg hover:translate-y-[-2px]"
              >
                Perfil
              </Link>
              <button
                onClick={logout}
                className="rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md hover:translate-y-[-2px]"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md hover:translate-y-[-2px]"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-principal-blue px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg hover:translate-y-[-2px]"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="text-principal-blue transition-transform duration-200 hover:scale-110 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="mx-auto mt-3 h-0.5 w-[70%] bg-secondary-blue"></div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
              >
                <Image
                  src="/logo.jpg"
                  alt="logoByCarket"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-xl font-semibold text-principal-blue">
                  ByCarket
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="transition-transform duration-200 hover:scale-110 hover:rotate-90"
              >
                <X className="h-6 w-6 text-principal-blue" />
              </button>
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              <Link
                href="/home"
                className="text-lg text-principal-blue transition-all duration-300 ease-in-out hover:pl-2 hover:text-secondary-blue"
                onClick={toggleMobileMenu}
              >
                Inicio
              </Link>
              <Link
                href="/marketplace"
                className="text-lg text-principal-blue transition-all duration-300 ease-in-out hover:pl-2 hover:text-secondary-blue"
                onClick={toggleMobileMenu}
              >
                Vehiculos
              </Link>

              <Link
                href="/suscription"
                className="text-lg text-principal-blue transition-all duration-300 ease-in-out hover:pl-2 hover:text-secondary-blue"
                onClick={toggleMobileMenu}
              >
                Premium
              </Link>
            </div>

            <div className="mt-auto space-y-2 pb-8">
              {isUserAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block w-full rounded-md bg-principal-blue px-4 py-2 text-center text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg"
                    onClick={toggleMobileMenu}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                    }}
                    className="w-full rounded-md border border-secondary-blue px-4 py-2 text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full rounded-md border border-secondary-blue px-4 py-2 text-center text-principal-blue shadow-sm transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:text-white hover:shadow-md"
                    onClick={toggleMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full rounded-md bg-principal-blue px-4 py-2 text-center text-white shadow-md transition-all duration-300 ease-in-out hover:bg-secondary-blue hover:shadow-lg"
                    onClick={toggleMobileMenu}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
