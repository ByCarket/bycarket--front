"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
	onSearch: (query: string) => void;
	initialQuery?: string;
}

const SearchBar = ({ onSearch, initialQuery = "" }: SearchBarProps) => {
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [focused, setFocused] = useState(false);
	
	useEffect(() => {
		setSearchQuery(initialQuery || "");
	}, [initialQuery]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimmedQuery = searchQuery.trim();
		onSearch(trimmedQuery);
	};

	return (
		<form
			onSubmit={handleSearch}
			className='w-full max-w-2xl mx-auto flex items-center gap-2'>
			<div className={`flex-1 flex items-center border ${focused ? 'border-[#103663] ring-2 ring-[#103663]/20' : 'border-gray-200'} bg-white rounded-xl px-3 transition-all duration-200 shadow-sm`}>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					width="16" 
					height="16" 
					fill={focused ? "#103663" : "#9CA3AF"} 
					viewBox="0 0 16 16"
					className="mr-2 flex-shrink-0">
					<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l.1.115 3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
				</svg>
				<input
					type='text'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					placeholder='Buscar vehículos por marca, modelo o versión...'
					className='w-full py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent'
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => setSearchQuery('')}
						className="ml-1 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>
			<button
				type='submit'
				className='py-2.5 px-4 rounded-xl bg-[#103663] hover:bg-[#0d2e55] text-white font-medium text-sm transition-colors flex items-center shadow-sm'
				aria-label='Buscar'>
				<span>Buscar</span>
			</button>
		</form>
	);
};

export default SearchBar;
