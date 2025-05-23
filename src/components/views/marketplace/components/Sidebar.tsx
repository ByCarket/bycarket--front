"use client";

import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const filters = (
    <div className="space-y-4">
      <FilterSection
        title="Rango de Precio (ARS)"
        name="price"
        options={[
          "< $5M",
          "$5M - $10M",
          "$10M - $15M",
          "$15M - $25M",
          "> $25M",
        ]}
      />
      <FilterSection
        title="Tipo de Vehículo"
        name="type"
        options={["Sedán", "SUV", "Pick-up", "Hatchback", "Van"]}
      />
      <FilterSection
        title="Marca"
        name="brand"
        options={["Toyota", "Ford", "VW", "Chevrolet", "Honda"]}
      />
      <FilterSection
        title="Año"
        name="year"
        options={["23-24", "20-22", "15-19", "10-14", "<10"]}
      />
    </div>
  );

  return (
    <>
      {/* Botón para abrir drawer en mobile */}
      <div className="p-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-full bg-[#facc15] text-[#103663] py-2 rounded-md font-semibold shadow-sm transition"
        >
          Filtros
        </button>
      </div>

      {/* Drawer overlay en mobile */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* Fondo semitransparente */}
          <div
            className="absolute inset-0 bg-white bg-opacity-50"
            onClick={() => setOpen(false)}
          />

          {/* Panel deslizable */}
          <aside className="relative w-64 bg-[#103663] text-white p-4 space-y-4">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-white text-xl"
              aria-label="Cerrar filtros"
            >
              &times;
            </button>

            {filters}

            <button
              onClick={() => {
                /* aquí aplicarías la lógica de filtros */
                setOpen(false);
              }}
              className="w-full bg-[#facc15] text-[#103663] hover:brightness-95 py-1.5 rounded-md font-semibold shadow-sm transition text-sm"
            >
              Aplicar Filtros
            </button>
          </aside>
        </div>
      )}

      {/* Sidebar fijo en desktop/tablet */}
      <aside className="hidden md:block w-full md:w-56 bg-[#103663] text-white py-4 px-3 space-y-4 rounded-lg">
        {filters}
        <button className="w-full bg-[#facc15] text-[#103663] hover:brightness-95 py-1.5 rounded-md font-semibold shadow-sm transition text-sm">
          Aplicar Filtros
        </button>
      </aside>
    </>
  );
}

function FilterSection({
  title,
  options,
  name,
  minimal = false,
}: {
  title: string;
  options: string[];
  name: string;
  minimal?: boolean;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <div className={minimal ? "" : "space-y-1.5"}>
        {options.map((label, index) => (
          <div className="flex items-center" key={index}>
            <input
              type="checkbox"
              id={`${name}-${index}`}
              className="mr-1.5 h-3 w-3 accent-white hover:cursor-pointer"
            />
            <label
              htmlFor={`${name}-${index}`}
              className="text-white hover:text-gray-300 cursor-pointer text-sm"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
