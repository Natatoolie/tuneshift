import { getUserAccount, prisma, userSession } from "./auth"
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
	console.log(savedPlaylists)
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
		savedPlaylists.items.map(async (items, index) => {
			const track = (await api.getPlaylistTracks(items.id)).body.items
			if (!track[0]?.track?.album.images[0]) return
			const parsedTrack = track.map(({ track }) => ({
				id: track?.id ?? "",
				name: track?.name ?? "",
				artist: track?.artists.map((artist) => artist.name).join(", ") ?? "",
				imageUrl: track?.album.images[0] ? track?.album?.images[0].url : "",
				// imageUrl: items.images ? items.images[0].url : "",
			}))
			playlist.push({
				id: items.id,
				name: items.name,
				description: items.description || "",
				trackCount: items.tracks.total,
				imageUrl: items.images ? items.images[0].url : "/globe.svg",
				isLikedTracks: false,

				tracks: parsedTrack,
			})
		})
	)

	return playlist
}

// MAX LIMIT: 50
export const getSpotifyPlaylists = async ({
	limit,
	offset,
}: {
	limit: number
	offset: number
}) => {
	const session = await userSession()
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
