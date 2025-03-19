import { getUserAccount } from "./auth"
import SpotifyWebApi from "spotify-web-api-node"

const spotifyCache: { [key: string]: SpotifyWebApi } = {}
const createSpotifyApi = async () => {
	const user = await getUserAccount()
	const accessToken = user?.accessToken
	if (spotifyCache[accessToken]) return spotifyCache[accessToken]
	spotifyCache[accessToken] = new SpotifyWebApi({
		accessToken: accessToken || "",
	})
	return spotifyCache[accessToken]
}

export interface SpotifyPlaylistType {
	id: string
	name: string
	description: string
	trackCount: number
	imageUrl: string
	isLikedTracks: boolean
	tracks: SpotifyTrackType[]
}
export interface SpotifyTrackType {
	id: string
	name: string
	artist: string
	imageUrl: string
}

const unifyPlaylists = async (
	likedPlaylist: SpotifyApi.UsersSavedTracksResponse,
	savedPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse,
	preview: boolean,
	api: SpotifyWebApi
) => {
	const playlist: SpotifyPlaylistType[] = []

	// Manually add liked tracks
	playlist.push({
		id: "liked",
		name: "Liked tracks",
		description: "Liked tracks",
		trackCount: likedPlaylist.total,
		imageUrl: "/spotifyLiked.jpg",
		isLikedTracks: true,
		tracks: likedPlaylist.items.map(({ track }) => ({
			id: track.id,
			name: track.name,
			artist: track.artists.map((artist) => artist.name).join(", "),
			imageUrl: track.album.images ? track.album.images[0].url : "",
		})),
	})
	// Dynamically add other tracks
	await Promise.all(
		savedPlaylists.items.map(async (parsedPlaylist) => {
			const allPlaylistTracks = preview
				? (await api.getPlaylistTracks(parsedPlaylist.id, { limit: 3 })).body
				: await getAllTracksFromPlaylist(api, parsedPlaylist.id)
			const parsedTrack = allPlaylistTracks.items.map(({ track }) => ({
				id: track?.id ?? "",
				name: track?.name ?? "",
				artist: track?.artists.map((artist) => artist.name).join(", ") ?? "",
				imageUrl: track?.album.images[0] ? track?.album?.images[0].url : "",
			}))
			playlist.push({
				id: parsedPlaylist.id,
				name: parsedPlaylist.name,
				description: parsedPlaylist.description || "",
				trackCount: parsedPlaylist.tracks.total,
				imageUrl: parsedPlaylist.images
					? parsedPlaylist.images[0].url
					: "/globe.svg",
				isLikedTracks: false,
				tracks: parsedTrack,
			})
		})
	)

	return playlist
}

export const getAllTracksFromPlaylist = async (
	api: SpotifyWebApi | null,
	playlistId: string
) => {
	const isLiked = playlistId === "liked"
	const spotify = await createSpotifyApi()
	const playlist = isLiked
		? await spotify.getMySavedTracks()
		: await spotify.getPlaylistTracks(playlistId)
	const tracks: SpotifyApi.PlaylistTrackObject[] = []
	let next: string | null = playlist.body.next
	let currentOffset = 0
	const limit = 50
	while (true) {
		const tracksResponse = isLiked
			? await spotify.getMySavedTracks({
					limit: limit,
					offset: currentOffset,
			  })
			: await spotify.getPlaylistTracks(playlistId, {
					limit: limit,
					offset: currentOffset,
			  })

		console.log(tracksResponse)
		tracks.push(
			...(tracksResponse.body.items as SpotifyApi.PlaylistTrackObject[])
		)
		if (!next) break
		next = tracksResponse.body.next
		currentOffset += limit
	}
	const data = {
		...playlist.body,
		items: tracks,
	}

	return data
}

export const getSpotifyTrackFromId = async (
	api: SpotifyWebApi | null,
	id: string
) => {
	const spotify = api || (await createSpotifyApi())
	const track = await spotify.getTrack(id)
	return track.body
}

export const getSpotifyPlaylists = async (preview: boolean) => {
	try {
		const spotify = await createSpotifyApi()
		console.log(spotify)

		const allSavedTracks = await spotify.getMySavedTracks({
			limit: 50,
			offset: 0,
		})
		const allSavedPlaylists = await spotify.getUserPlaylists({
			limit: 50,
			offset: 0,
		})

		const savedTracks: SpotifyApi.UsersSavedTracksResponse = allSavedTracks.body
		const savedPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse =
			allSavedPlaylists.body

		let offset = 50
		while (allSavedTracks.body.next) {
			const nextSavedTracks = await spotify.getMySavedTracks({
				limit: preview ? 3 : 50,
				offset: offset,
			})
			savedTracks.items.push(...nextSavedTracks.body.items)
			offset += 50
			if (!nextSavedTracks.body.next) break
		}

		offset = 50
		while (allSavedPlaylists.body.next) {
			const nextSavedPlaylists = await spotify.getUserPlaylists({
				limit: 50,
				offset: offset,
			})
			savedPlaylists.items.push(...nextSavedPlaylists.body.items)
			offset += 50
			if (!nextSavedPlaylists.body.next) break
		}
		savedTracks.total = savedTracks.items.length
		savedPlaylists.total = savedPlaylists.items.length

		const unifiedPlaylists = await unifyPlaylists(
			savedTracks,
			savedPlaylists,
			preview,
			spotify
		)

		return { success: true, data: unifiedPlaylists }
	} catch {
		// console.log(error.headers)
		return {
			success: false,
		}
	}
}
