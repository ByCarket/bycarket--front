import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomeBannerProps {
	backgroundColor?: string;
}

export default function HomeBanner({
	backgroundColor = "bg-principal-blue",
}: HomeBannerProps) {
	return (
		<div className='mt-10 mb-20 relative w-[80%] h-[60vh] mx-auto overflow-hidden rounded-[50px]'>
			<div className={`relative w-full h-full ${backgroundColor}`}>
				<button className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors'>
					<ChevronLeft className='text-white stroke-2' />
				</button>

				<button className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors'>
					<ChevronRight className='text-white stroke-2' />
				</button>
			</div>
		</div>
	);
}
