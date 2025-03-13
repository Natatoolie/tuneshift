import { ListMusic, Music2 } from "lucide-react"

const SpotifyPlaylistSkeleton = () => {
	return (
		<div className='w-full max-w-6xl mx-auto'>
			<div className='bg-gray-900 rounded-xl border border-gray-800 overflow-hidden'>
				{/* Header Skeleton */}
				<div className='border-b border-gray-800 p-6'>
					<div className='flex items-center justify-between flex-wrap gap-4'>
						<div>
							<div className='flex items-center gap-2'>
								<Music2 className='h-6 w-6 text-green-500/50' />
								<div className='h-8 w-48 bg-gray-800 rounded-md animate-pulse'></div>
							</div>
							<div className='h-4 w-64 bg-gray-800 rounded-md animate-pulse mt-2'></div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='h-9 w-24 bg-gray-800 rounded-md animate-pulse'></div>
							<div className='h-9 w-40 bg-green-800/30 rounded-md animate-pulse'></div>
						</div>
					</div>
				</div>

				{/* Playlists Grid Skeleton */}
				<div className='p-6'>
					<div className='mb-4 flex justify-between items-center'>
						<div className='flex items-center gap-2'>
							<ListMusic className='h-5 w-5 text-gray-700' />
							<div className='h-6 w-32 bg-gray-800 rounded-md animate-pulse'></div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Generate 6 playlist skeletons */}
						{Array(6)
							.fill(0)
							.map((_, index) => (
								<PlaylistSkeleton key={index} />
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

const PlaylistSkeleton = () => {
	return (
		<div className='rounded-lg border border-gray-800 bg-gray-800/30 overflow-hidden p-4'>
			<div className='flex gap-3'>
				{/* Playlist image skeleton */}
				<div className='h-16 w-16 bg-gray-800 rounded-md animate-pulse'></div>

				<div className='flex-1 min-w-0'>
					<div className='flex items-center justify-between'>
						{/* Playlist title skeleton */}
						<div className='h-5 w-32 bg-gray-800 rounded-md animate-pulse'></div>

						<div className='flex items-center gap-2'>
							{/* Checkbox skeleton */}
							<div className='h-4 w-4 bg-gray-800 rounded-sm animate-pulse'></div>
							{/* Expand button skeleton */}
							<div className='h-6 w-6 bg-gray-800 rounded-full animate-pulse'></div>
						</div>
					</div>

					{/* Description skeleton */}
					<div className='h-4 w-full bg-gray-800 rounded-md animate-pulse mt-2'></div>

					{/* Track count skeleton */}
					<div className='h-3 w-20 bg-gray-800 rounded-md animate-pulse mt-3'></div>
				</div>
			</div>
		</div>
	)
}

export default SpotifyPlaylistSkeleton
