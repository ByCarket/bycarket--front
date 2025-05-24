import { useState } from "react";
import { VehicleTypeEnum } from "@/enums/vehicleType.enum";
import { VehicleCondition } from "@/enums/vehicleCondition.enum";
import { CurrencyEnum } from "@/enums/currency.enum";
import { OrderByPostsEnum } from "@/enums/orderByPosts.enum";
import { OrderDirectionEnum } from "@/enums/order.enum";

export interface FilterState {
	brandId?: string;
	modelId?: string;
	versionId?: string;
	typeOfVehicle?: VehicleTypeEnum;
	condition?: typeof VehicleCondition;
	currency?: CurrencyEnum;
	minYear?: number;
	maxYear?: number;
	minPrice?: number;
	maxPrice?: number;
	minMileage?: number;
	maxMileage?: number;
	search?: string;
	orderBy?: OrderByPostsEnum;
	order?: OrderDirectionEnum;
}

export const useFilters = (initialFilters: FilterState = {}) => {
	const [filters, setFilters] = useState<FilterState>(initialFilters);

	const updateFilter = (key: keyof FilterState, value: any) => {
		if (value === undefined || value === "") {
			const newFilters = { ...filters };
			delete newFilters[key];
			setFilters(newFilters);
		} else {
			setFilters((prev) => ({ ...prev, [key]: value }));
		}
	};

	const resetFilters = () => {
		setFilters({});
	};

	const setPriceRange = (range: string) => {
		const newFilters = { ...filters };

		switch (range) {
			case "< $5M":
				newFilters.minPrice = 0;
				newFilters.maxPrice = 5000000;
				break;
			case "$5M - $10M":
				newFilters.minPrice = 5000000;
				newFilters.maxPrice = 10000000;
				break;
			case "$10M - $15M":
				newFilters.minPrice = 10000000;
				newFilters.maxPrice = 15000000;
				break;
			case "$15M - $25M":
				newFilters.minPrice = 15000000;
				newFilters.maxPrice = 25000000;
				break;
			case "> $25M":
				newFilters.minPrice = 25000000;
				delete newFilters.maxPrice;
				break;
			default:
				delete newFilters.minPrice;
				delete newFilters.maxPrice;
		}

		setFilters(newFilters);
	};

	const setYearRange = (range: string) => {
		const currentYear = new Date().getFullYear();
		const newFilters = { ...filters };

		switch (range) {
			case "23-24":
				newFilters.minYear = 2023;
				newFilters.maxYear = currentYear;
				break;
			case "20-22":
				newFilters.minYear = 2020;
				newFilters.maxYear = 2022;
				break;
			case "15-19":
				newFilters.minYear = 2015;
				newFilters.maxYear = 2019;
				break;
			case "10-14":
				newFilters.minYear = 2010;
				newFilters.maxYear = 2014;
				break;
			case "<10":
				newFilters.maxYear = 2009;
				break;
			default:
				delete newFilters.minYear;
				delete newFilters.maxYear;
		}

		setFilters(newFilters);
	};

	return {
		filters,
		updateFilter,
		resetFilters,
		setPriceRange,
		setYearRange,
	};
};
