import { useState, useEffect } from "react";
import { getPosts, GetPostsResponse, PostResponse } from "@/services/vehicle.service";

export const useFetchPosts = (initialPage: number = 1, initialLimit: number = 10) => {
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
				const response = await getPosts(currentPage, initialLimit);
				setPosts(response.data);
				setTotalItems(response.total);
				setTotalPages(response.totalPages);
			} catch (err: any) {
				setError("Hubo un error al cargar los posts. Inténtalo de nuevo más tarde.");
			} finally {
				setLoading(false);
			}
		};

		fetchPostsData();
	}, [currentPage, initialLimit]);

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