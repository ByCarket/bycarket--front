export default function Sidebar() {
  return (
    <aside className="w-full md:w-56 bg-[#103663] text-white py-4 px-3 space-y-4 rounded-lg">
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

      <div>
        <button className="w-full bg-[#facc15] text-[#103663] hover:brightness-95 py-1.5 px-3 rounded-md font-semibold shadow-sm transition text-sm">
          Aplicar Filtros
        </button>
      </div>
    </aside>
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
