"use client";

import { useSearchParams } from "@/hooks/useSearchParams";

type OrderOption = {
  label: string;
  value: string;
  direction?: "ASC" | "DESC";
};

export function OrderBy() {
  const { params, setSorting } = useSearchParams();

  const orderOptions: OrderOption[] = [
    { label: "Más recientes", value: "posts.postDate", direction: "DESC" },
    { label: "Más antiguos", value: "posts.postDate", direction: "ASC" },
    {
      label: "Precio: menor a mayor",
      value: "vehicle.price",
      direction: "ASC",
    },
    {
      label: "Precio: mayor a menor",
      value: "vehicle.price",
      direction: "DESC",
    },
    { label: "Año: más nuevos", value: "vehicle.year", direction: "DESC" },
    { label: "Año: más antiguos", value: "vehicle.year", direction: "ASC" },
    {
      label: "Kilometraje: menor a mayor",
      value: "vehicle.mileage",
      direction: "ASC",
    },
    {
      label: "Kilometraje: mayor a menor",
      value: "vehicle.mileage",
      direction: "DESC",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = orderOptions.find(
      (option) => `${option.value}-${option.direction}` === selectedValue
    );

    if (selectedOption) {
      setSorting(selectedOption.value as any, selectedOption.direction);
    }
  };

  const currentValue =
    params.orderBy && params.order
      ? `${params.orderBy}-${params.order}`
      : `posts.postDate-DESC`;

  return (
    <div className="relative w-full">
      <div className="relative">
        <select
          className="w-full appearance-none bg-white border-2 border-gray-200 hover:border-var(--color-secondary-blue) focus:border-var(--color-principal-blue) rounded-xl py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-var(--color-secondary-blue)/50 transition-all duration-200 cursor-pointer"
          value={currentValue}
          onChange={handleChange}
        >
          {orderOptions.map((option) => (
            <option
              key={`${option.value}-${option.direction}`}
              value={`${option.value}-${option.direction}`}
              className="text-gray-700"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
