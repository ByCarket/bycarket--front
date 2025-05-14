export function DotSeparator() {
	return (
		<div className='flex items-center justify-center w-full my-4'>
			<div className='flex items-center space-x-2'>
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className={`rounded-full bg-blue-400 ${
							i % 2 === 0 ? "w-1 h-1" : "w-1.5 h-1.5"
						}`}
					/>
				))}
			</div>
		</div>
	);
}
