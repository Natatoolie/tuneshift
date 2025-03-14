import { getUserAccount } from "./auth"
import SpotifyWebApi from "spotify-web-api-node"

const createSpotifyApi = async () => {
	const user = await getUserAccount()
	const accessToken = user?.accessToken
	const x = new SpotifyWebApi({
		accessToken: accessToken || "",
	})
	return x
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
	api: SpotifyWebApi
) => {
	const playlist: SpotifyPlaylistType[] = []
	// console.log(likedPlaylist)

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
			// imageUrl: "/spotifyLiked.jpg",
			imageUrl: track.album.images ? track.album.images[0].url : "",
		})),
	})
	// Dynamically add other tracks
	await Promise.all(
		savedPlaylists.items.map(async (parsedPlaylist) => {
			const track = (await api.getPlaylistTracks(parsedPlaylist.id)).body.items
			if (!track[0]?.track?.album.images[0]) return
			const parsedTrack = track.map(({ track }) => ({
				id: track?.id ?? "",
				name: track?.name ?? "",
				artist: track?.artists.map((artist) => artist.name).join(", ") ?? "",
				imageUrl: track?.album.images[0] ? track?.album?.images[0].url : "",
				// imageUrl: items.images ? items.images[0].url : "",
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
	api: SpotifyWebApi,
	playlistId: string
) => {
	const spotify = api || (await createSpotifyApi())
	const playlist = await spotify.getPlaylist(playlistId)
	const tracks: SpotifyApi.PlaylistTrackObject[] = []
	let next = playlist.body.tracks.next
	while (next) {
		const tracksResponse = await spotify.getPlaylistTracks(playlistId, {
			limit: 50,
			offset: tracks.length,
		})
		tracks.push(...tracksResponse.body.items)
		next = tracksResponse.body.next
	}
	const data = {
		...playlist.body,
		tracks: tracks,
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

// MAX LIMIT: 50
export const getSpotifyPlaylists = async ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
	const spotify = await createSpotifyApi()
	const savedTracks = await spotify.getMySavedTracks({
		limit: limit,
		offset: offset,
	})
	const savedPlaylists = await spotify.getUserPlaylists({
		limit: limit,
		offset: offset,
	})

	const unifiedPlaylists = await unifyPlaylists(
		savedTracks.body,
		savedPlaylists.body,
		spotify
	)
	// savedPlaylists.body.items[0]
	// savedTracks.body.items[0].track
	return unifiedPlaylists
}
