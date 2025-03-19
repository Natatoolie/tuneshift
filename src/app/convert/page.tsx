import React, { Suspense } from "react"
import ConvertTitle from "./ConvertTitle"
import { getSpotifyPlaylists, SpotifyPlaylistType } from "@/lib/spotify"
import SpotifyPlaylist from "./SpotifyPlaylist"
import { verifyBothLogins } from "@/lib/auth"
import { redirect } from "next/navigation"
import SpotifyPlaylistSkeleton from "./SpotifyPlaylistSkeleton"

const SpotifyPlaylistSuspense = async () => {
	const spotifyPlaylist = await getSpotifyPlaylists(true)
	if (spotifyPlaylist.success === false) {
		console.log(spotifyPlaylist.data)
		return <>A problem has occurred...</>
	}

	return (
		<SpotifyPlaylist
			spotifyPlaylist={spotifyPlaylist.data as SpotifyPlaylistType[]}
		/>
	)
}

const Convert = async () => {
	const hasAccess = await verifyBothLogins()
	if (hasAccess.success === false) redirect("/connect")

	return (
		<div className='min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white'>
			<div className='container mx-auto px-4 py-16'>
				<ConvertTitle />
				<Suspense fallback={<SpotifyPlaylistSkeleton />}>
					<SpotifyPlaylistSuspense />
				</Suspense>
			</div>
		</div>
	)
}

export default Convert
