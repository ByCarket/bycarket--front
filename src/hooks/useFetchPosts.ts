import { useState, useEffect } from "react";
import { getPosts, GetPostsResponse, PostResponse } from "@/services/vehicle.service";
import { FilterState } from "./useFilters";

export const useFetchPosts = (
	initialPage: number = 1,
	initialLimit: number = 10,
	filters: FilterState = {}
) => {
	const [posts, setPosts] = useState<PostResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		const fetchPostsData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await getPosts(currentPage, initialLimit, filters);
				setPosts(response.data || []);
				setTotalItems(response.total || 0);
				setTotalPages(response.totalPages || 1);
			} catch (err: any) {
				setPosts([]);
				setTotalItems(0);
				setTotalPages(1);
				setError(null);
			} finally {
				setLoading(false);
			}
		};

		fetchPostsData();
	}, [currentPage, initialLimit, filters]);

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	return {
		posts,
		loading,
		error,
		currentPage,
		totalPages,
		totalItems,
		handlePageChange,
	};
};