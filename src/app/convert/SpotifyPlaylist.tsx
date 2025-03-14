"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SpotifyPlaylistType, SpotifyTrackType } from "@/lib/spotify"
import {
	Music2,
	ChevronDown,
	ChevronUp,
	RefreshCw,
	CheckCircle,
	ListMusic,
	ArrowRight,
	Youtube,
	AlertCircle,
	XCircle,
} from "lucide-react"
import { convertSpotifyTrackToYoutube, createPlaylist } from "@/actions/ytmusic"

interface ConversionError {
	playlistId: string
	trackId: string
	trackName: string
	error: string
}

const SpotifyPlaylist = ({
	spotifyPlaylist,
}: {
	spotifyPlaylist: SpotifyPlaylistType[]
}) => {
	const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([])
	const [expandedPlaylists, setExpandedPlaylists] = useState<string[]>([])
	const [isConverting, setIsConverting] = useState(false)
	const [conversionProgress, setConversionProgress] = useState(0)
	const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null)
	const [currentTrack, setCurrentTrack] = useState<string | null>(null)
	const [completedPlaylists, setCompletedPlaylists] = useState<string[]>([])
	const [showCompletionAlert, setShowCompletionAlert] = useState(false)
	const [conversionErrors, setConversionErrors] = useState<ConversionError[]>(
		[]
	)
	const [showErrors, setShowErrors] = useState(false)

	const handlePlaylistToggle = (playlistId: string) => {
		setSelectedPlaylists((prev) =>
			prev.includes(playlistId)
				? prev.filter((id) => id !== playlistId)
				: [...prev, playlistId]
		)
	}

	const handleExpandToggle = (playlistId: string) => {
		setExpandedPlaylists((prev) =>
			prev.includes(playlistId)
				? prev.filter((id) => id !== playlistId)
				: [...prev, playlistId]
		)
	}

	const handleSelectAllPlaylists = () => {
		if (selectedPlaylists.length === spotifyPlaylist.length) {
			setSelectedPlaylists([])
		} else {
			setSelectedPlaylists(
				spotifyPlaylist.map((playlist) => playlist.id.toString())
			)
		}
	}

	// Simulate track conversion with potential failures

	const convertTrack = async (
		track: SpotifyTrackType,
		playlistId: string | undefined
	): Promise<boolean> => {
		return new Promise(async (resolve) => {
			if (!playlistId) {
				console.log("Playlist ID not found")
				resolve(false)
				return
			}

			const res = await convertSpotifyTrackToYoutube(playlistId, track.id)
			console.log(res)
			if (!res.success) {
				setConversionErrors((prev) => [
					...prev,
					{
						playlistId,
						trackId: track.id,
						trackName: track.name,
						error: "Unable to find matching track on YouTube Music",
					},
				])
			}
			resolve(res.success)
			// 	}if (!success) {
			// 		setConversionErrors((prev) => [
			// 			...prev,
			// 			{
			// 				playlistId,
			// 				trackId: track.id,
			// 				trackName: track.name,
			// 				error: "Unable to find matching track on YouTube Music",
			// 			},
			// 		])
			// 	}

			// setTimeout(() => {
			// 	// Simulate random conversion failures (20% chance)
			// 	const success = Math.random() > 0.2
			// 	if (!success) {
			// 		setConversionErrors((prev) => [
			// 			...prev,
			// 			{
			// 				playlistId,
			// 				trackId: track.id,
			// 				trackName: track.name,
			// 				error: "Unable to find matching track on YouTube Music",
			// 			},
			// 		])
			// 	}
			// 	resolve(success)
			// }, 500)
		})
	}

	const handleConvert = async () => {
		setIsConverting(true)
		setConversionProgress(0)
		setCompletedPlaylists([])
		setConversionErrors([])
		setShowErrors(false)

		// Get the selected playlist objects
		const playlistsToConvert = spotifyPlaylist.filter((playlist) =>
			selectedPlaylists.includes(playlist.id.toString())
		)

		let currentIndex = 0
		const totalPlaylists = playlistsToConvert.length

		for (const playlist of playlistsToConvert) {
			setCurrentPlaylist(playlist.name)

			const ytPlaylist = await createPlaylist(playlist)

			// Process each track in the playlist
			for (const track of playlist.tracks) {
				setCurrentTrack(track.name)

				// Attempt to convert the track
				await convertTrack(track, ytPlaylist.id)

				// Update progress based on tracks
				const trackProgress =
					(playlist.tracks.indexOf(track) + 1) / playlist.tracks.length
				const overallProgress = Math.floor(
					(currentIndex / totalPlaylists + trackProgress / totalPlaylists) * 100
				)
				setConversionProgress(overallProgress)
			}

			setCompletedPlaylists((prev) => [...prev, playlist.id.toString()])
			currentIndex++
			setCurrentTrack(null)
		}

		// Conversion complete
		setConversionProgress(100)
		setCurrentPlaylist(null)
		setShowCompletionAlert(true)

		if (conversionErrors.length > 0) {
			setShowErrors(true)
		}

		// Reset after delay
		setTimeout(() => {
			setIsConverting(false)
			setShowCompletionAlert(false)
		}, 5000)
	}

	const totalSelected = selectedPlaylists.length

	// Find the playlist name by ID
	const getPlaylistName = (id: string) => {
		const playlist = spotifyPlaylist.find((p) => p.id.toString() === id)
		return playlist ? playlist.name : id
	}

	// Get failed tracks for a specific playlist
	const getFailedTracks = (playlistId: string) => {
		return conversionErrors.filter((error) => error.playlistId === playlistId)
	}

	return (
		<div className='w-full max-w-6xl mx-auto'>
			<AnimatePresence>
				{showCompletionAlert && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='bg-green-900 border border-green-700 rounded-lg p-4 mb-6 text-white flex items-center gap-3'
					>
						<div className='bg-green-700 rounded-full p-2'>
							<CheckCircle className='h-6 w-6' />
						</div>
						<div>
							<h3 className='font-semibold text-lg'>Conversion Complete!</h3>
							<p className='text-green-100'>
								Successfully converted {completedPlaylists.length} playlists to
								YouTube Music.
								{conversionErrors.length > 0 && (
									<span className='text-yellow-200 ml-1'>
										({conversionErrors.length} tracks failed)
									</span>
								)}
							</p>
						</div>
					</motion.div>
				)}

				{showErrors && conversionErrors.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6 text-white'
					>
						<div className='flex items-center gap-2 mb-3'>
							<AlertCircle className='h-5 w-5 text-red-400' />
							<h3 className='font-semibold'>Failed to Convert Some Tracks</h3>
						</div>
						<div className='space-y-2'>
							{conversionErrors.map((error, index) => {
								const playlist = spotifyPlaylist.find(
									(p) => p.id === error.playlistId
								)
								return (
									<div
										key={`${error.trackId}-${index}`}
										className='flex items-center gap-2 text-sm text-red-200'
									>
										<XCircle className='h-4 w-4 text-red-400 flex-shrink-0' />
										<span className='opacity-75'>
											Failed to convert &quot;{error.trackName}&quot; from
											playlist &quot;
											{playlist?.name}&quot;
										</span>
									</div>
								)
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className='bg-gray-900 rounded-xl border border-gray-800 overflow-hidden'>
				{/* Header */}
				<div className='border-b border-gray-800 p-6'>
					<div className='flex items-center justify-between flex-wrap gap-4'>
						<div>
							<h2 className='text-2xl font-bold text-white flex items-center gap-2'>
								<Music2 className='h-6 w-6 text-green-500' />
								<span>Spotify to YouTube Music</span>
							</h2>
							<p className='text-gray-400 mt-1'>
								Select playlists to convert to YouTube Music
							</p>
						</div>
						<div className='flex items-center gap-3'>
							<Button
								size='sm'
								onClick={handleSelectAllPlaylists}
								disabled={isConverting}
								className='border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
							>
								{selectedPlaylists.length === spotifyPlaylist.length
									? "Deselect All"
									: "Select All"}
							</Button>
							<Button
								onClick={handleConvert}
								disabled={totalSelected === 0 || isConverting}
								className='bg-green-600 hover:bg-green-700 text-white gap-2'
							>
								{isConverting ? (
									<>
										<RefreshCw className='h-4 w-4 animate-spin' />
										<span className='hidden sm:inline'>Converting...</span>
										<span className='sm:hidden'>Converting</span>
									</>
								) : (
									<>
										<Youtube className='h-4 w-4' />
										<span className='hidden sm:inline'>
											Convert to YouTube Music
										</span>
										<span className='sm:hidden'>Convert</span>
									</>
								)}
							</Button>
						</div>
					</div>

					{/* Conversion Progress */}
					<AnimatePresence>
						{isConverting && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className='mt-6'
							>
								<div className='flex justify-between items-center mb-2'>
									<div className='flex items-center gap-2 text-gray-300'>
										<RefreshCw className='h-4 w-4 animate-spin text-green-500' />
										<span>Converting playlists...</span>
									</div>
									<span className='text-gray-300 font-medium'>
										{conversionProgress}%
									</span>
								</div>
								<div className='h-2 bg-gray-800 rounded-full overflow-hidden'>
									<motion.div
										className='h-full bg-green-500'
										initial={{ width: 0 }}
										animate={{ width: `${conversionProgress}%` }}
										transition={{ ease: "easeOut" }}
									/>
								</div>

								{currentPlaylist && (
									<div className='mt-3 flex items-center gap-2 text-gray-300'>
										<ArrowRight className='h-4 w-4 text-green-500' />
										<span>
											Currently converting:{" "}
											<span className='font-medium text-green-400'>
												{currentPlaylist}
											</span>
											{currentTrack && (
												<span className='text-gray-400'> - {currentTrack}</span>
											)}
										</span>
									</div>
								)}

								{completedPlaylists.length > 0 && (
									<div className='mt-4 bg-gray-800/50 rounded-lg p-3'>
										<div className='flex items-center gap-2 text-gray-300 mb-2'>
											<CheckCircle className='h-4 w-4 text-green-500' />
											<span className='font-medium'>
												Completed ({completedPlaylists.length}/
												{selectedPlaylists.length})
											</span>
											{conversionErrors.length > 0 && (
												<span className='text-red-400 text-sm'>
													• {conversionErrors.length} failed
												</span>
											)}
										</div>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
											{completedPlaylists.map((id) => (
												<div
													key={id}
													className='flex items-center gap-2 text-gray-400 text-sm'
												>
													<div className='w-1 h-1 bg-green-500 rounded-full'></div>
													<span className='truncate'>
														{getPlaylistName(id)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Playlists Grid */}
				<div className='p-6'>
					<div className='mb-4 flex justify-between items-center'>
						<h3 className='text-lg font-medium text-white flex items-center gap-2'>
							<ListMusic className='h-5 w-5 text-gray-400' />
							<span>Your Playlists</span>
							<Badge
								variant='outline'
								className='ml-2 text-gray-400 bg-gray-800/50'
							>
								{totalSelected} selected
							</Badge>
						</h3>
					</div>

					<ScrollArea className='h-[500px] pr-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{spotifyPlaylist.map((playlist) => {
								const isExpanded = expandedPlaylists.includes(
									playlist.id.toString()
								)
								const isSelected = selectedPlaylists.includes(
									playlist.id.toString()
								)
								const isCompleted = completedPlaylists.includes(
									playlist.id.toString()
								)
								const isConverting = currentPlaylist === playlist.name
								const failedTracks = getFailedTracks(playlist.id)
								const hasErrors = failedTracks.length > 0

								return (
									<div
										key={playlist.id}
										className={`rounded-lg border overflow-hidden ${
											isConverting
												? "border-green-600 bg-green-900/20"
												: isCompleted && hasErrors
												? "border-yellow-800 bg-gray-800/50"
												: isCompleted
												? "border-green-800 bg-gray-800/50"
												: "border-gray-800 bg-gray-800/30 hover:bg-gray-800/50"
										} transition-colors`}
									>
										<div className='p-4'>
											<div className='flex gap-3'>
												<div className='relative flex-shrink-0'>
													<img
														src={playlist.imageUrl || "/globe.svg"}
														alt={playlist.name}
														className='h-16 w-16 rounded-md object-cover'
													/>
													{(isConverting || isCompleted) && (
														<div
															className={`absolute -top-1 -right-1 rounded-full p-1 ${
																isConverting
																	? "bg-green-600"
																	: hasErrors
																	? "bg-yellow-600"
																	: "bg-green-700"
															}`}
														>
															{isConverting ? (
																<RefreshCw className='h-3 w-3 text-white animate-spin' />
															) : hasErrors ? (
																<AlertCircle className='h-3 w-3 text-white' />
															) : (
																<CheckCircle className='h-3 w-3 text-white' />
															)}
														</div>
													)}
												</div>

												<div className='flex-1 min-w-0'>
													<div className='flex items-center justify-between'>
														<h4 className='font-medium text-white truncate'>
															{playlist.name}
														</h4>
														<div className='flex items-center gap-2'>
															<div className='flex items-center'>
																<Checkbox
																	id={`playlist-${playlist.id}`}
																	checked={isSelected}
																	onCheckedChange={() =>
																		handlePlaylistToggle(playlist.id.toString())
																	}
																	className='border-gray-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
																	disabled={isConverting}
																/>
															</div>
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.95 }}
																onClick={() =>
																	handleExpandToggle(playlist.id.toString())
																}
																className='text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700'
																disabled={isConverting}
															>
																{isExpanded ? (
																	<ChevronUp className='h-4 w-4' />
																) : (
																	<ChevronDown className='h-4 w-4' />
																)}
															</motion.button>
														</div>
													</div>

													<p className='text-sm text-gray-400 truncate mt-1'>
														{playlist.description}
													</p>

													<div className='flex items-center gap-3 mt-2 text-xs text-gray-500'>
														<div className='flex items-center gap-1'>
															<ListMusic className='h-3 w-3' />
															<span>{playlist.trackCount} tracks</span>
														</div>
														{hasErrors && (
															<div className='flex items-center gap-1 text-yellow-500'>
																<AlertCircle className='h-3 w-3' />
																<span>{failedTracks.length} failed</span>
															</div>
														)}
													</div>
												</div>
											</div>

											<AnimatePresence>
												{isExpanded && (
													<motion.div
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														transition={{ duration: 0.2 }}
														className='mt-4 pt-4 border-t border-gray-800'
													>
														{hasErrors ? (
															<>
																<h5 className='text-xs uppercase tracking-wider text-red-500 mb-3 flex items-center gap-2'>
																	<AlertCircle className='h-3 w-3' />
																	Failed Tracks
																</h5>
																<div className='space-y-3'>
																	{failedTracks.map((error) => {
																		const track = playlist.tracks.find(
																			(t) => t.id === error.trackId
																		)
																		if (!track) return null

																		return (
																			<motion.div
																				key={error.trackId}
																				initial={{ opacity: 0, x: -10 }}
																				animate={{ opacity: 1, x: 0 }}
																				transition={{ duration: 0.2 }}
																				className='flex items-center gap-3'
																			>
																				<img
																					src={track.imageUrl || "/globe.svg"}
																					alt={track.name}
																					className='h-10 w-10 rounded object-cover'
																				/>
																				<div className='flex-1 min-w-0'>
																					<div className='flex items-center gap-2'>
																						<p className='text-sm font-medium text-white truncate'>
																							{track.name}
																						</p>
																						<Badge
																							variant='outline'
																							className='bg-red-900/30 text-red-400 border-red-800'
																						>
																							Failed
																						</Badge>
																					</div>
																					<p className='text-xs text-gray-400 truncate'>
																						{track.artist}
																					</p>
																				</div>
																			</motion.div>
																		)
																	})}
																</div>
															</>
														) : (
															<>
																<h5 className='text-xs uppercase tracking-wider text-gray-500 mb-3'>
																	Top Tracks
																</h5>
																<div className='space-y-3'>
																	{playlist.tracks.slice(0, 3).map((track) => (
																		<motion.div
																			key={track.id}
																			initial={{ opacity: 0, x: -10 }}
																			animate={{ opacity: 1, x: 0 }}
																			transition={{ duration: 0.2 }}
																			className='flex items-center gap-3'
																		>
																			<img
																				src={track.imageUrl || "/globe.svg"}
																				alt={track.name}
																				className='h-10 w-10 rounded object-cover'
																			/>
																			<div className='flex-1 min-w-0'>
																				<p className='text-sm font-medium text-white truncate'>
																					{track.name}
																				</p>
																				<p className='text-xs text-gray-400 truncate'>
																					{track.artist}
																				</p>
																			</div>
																		</motion.div>
																	))}
																</div>
															</>
														)}
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</div>
								)
							})}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	)
}

export default SpotifyPlaylist
