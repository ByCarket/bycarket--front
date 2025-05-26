import { useState, useCallback } from "react";
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

	const updateFilter = useCallback((key: keyof FilterState, value: any) => {
		if (value === undefined || value === "") {
			const newFilters = { ...filters };
			delete newFilters[key];
			setFilters(newFilters);
		} else {
			setFilters((prev) => ({ ...prev, [key]: value }));
		}
	}, [filters]);

	const resetFilters = useCallback(() => {
		setFilters({});
	}, []);

	const setPriceRange = useCallback((range: string) => {
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
				newFilters.maxPrice = Number.MAX_SAFE_INTEGER;
				break;
			default:
				delete newFilters.minPrice;
				delete newFilters.maxPrice;
		}

		setFilters(newFilters);
	}, [filters]);

	const setYearRange = useCallback((range: string) => {
		const currentYear = new Date().getFullYear();
		const newFilters = { ...filters };

		switch (range) {
			case "2020 - Actual":
				newFilters.minYear = 2020;
				newFilters.maxYear = currentYear;
				break;
			case "2015 - 2019":
				newFilters.minYear = 2015;
				newFilters.maxYear = 2019;
				break;
			case "2010 - 2014":
				newFilters.minYear = 2010;
				newFilters.maxYear = 2014;
				break;
			case "2000 - 2009":
				newFilters.minYear = 2000;
				newFilters.maxYear = 2009;
				break;
			case "< 2000":
				newFilters.minYear = 1950;
				newFilters.maxYear = 1999;
				break;
			default:
				delete newFilters.minYear;
				delete newFilters.maxYear;
		}

		setFilters(newFilters);
	}, [filters]);

	const setMultipleFilters = useCallback((newFilters: FilterState) => {
		setFilters(prev => ({ ...prev, ...newFilters }));
	}, []);
	
	return {
		filters,
		updateFilter,
		resetFilters,
		setPriceRange,
		setYearRange,
		setMultipleFilters,
	};
};
