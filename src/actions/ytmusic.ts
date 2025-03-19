"use server"

import { prisma, userSession } from "@/lib/auth"
import {
	getAllTracksFromPlaylist,
	getSpotifyTrackFromId,
	SpotifyPlaylistType,
} from "@/lib/spotify"
import { parseHeadersToJSON } from "@/lib/utils"

import YouTubeMusic, {
	ITrackDetail,
	IYouTubeMusicAuthenticated,
} from "youtube-music-ts-api"
import YTMusic from "ytmusic-api"

const YTMusicUserSingleton = new YouTubeMusic()
const YTMusicApiSingleton = new YTMusic()

const userCache: {
	[userId: string]: {
		ytMusicUser: IYouTubeMusicAuthenticated
		ytMusicApi: YTMusic
	}
} = {}

export async function verifyYoutubeCookie(cookie: string) {
	try {
		const e = await YTMusicUserSingleton.authenticate(cookie)
		await e.getLibraryPlaylists()

		return {
			success: true,
			message: "Valid cookie.",
		}
	} catch {
		return {
			success: false,
			message: "Invalid cookie.",
		}
	}
}

export async function verifyYoutubeHeaders(_: unknown, formData: FormData) {
	const formHeaders = formData.get("headers")
	if (!formHeaders)
		return {
			success: false,
			message: "Please enter headers.",
		}

	const parsedHeaders = parseHeadersToJSON(formHeaders.toString())
	if (parsedHeaders === undefined) {
		return {
			success: false,
			message: "Invalid headers.",
		}
	}

	try {
		const acc = await YTMusicUserSingleton.authenticate(parsedHeaders.Cookie)
		await acc.getLibraryPlaylists()
		const user = await userSession()
		await prisma.user.update({
			data: {
				youtubeId: parsedHeaders.Cookie,
			},
			where: {
				id: user?.user.id,
			},
		})
		// redirect("/")
		return {
			success: true,
			message: "Sucess! Redirecting...",
		}
	} catch {
		return {
			success: false,
			message: "Invalid cookie.",
		}
	}
}

export const createPlaylist = async (spotifyPlaylist: SpotifyPlaylistType) => {
	const user = await userSession()
	const acc = await YTMusicUserSingleton.authenticate(
		user?.user.youtubeId as string
	)
	const ytPlaylist = await acc.createPlaylist(spotifyPlaylist.name, "SPOTIFY!")
	return ytPlaylist
}

export const convertSpotifyTrackToYoutube = async (
	playlistId: string,
	trackId: string
) => {
	try {
		const user = await userSession()

		const ytMusicApi =
			userCache[user?.user.id as string]?.ytMusicApi ||
			(await YTMusicApiSingleton.initialize())

		const ytMusicUser =
			userCache[user?.user.id as string]?.ytMusicUser ||
			(await YTMusicUserSingleton.authenticate(user?.user.youtubeId as string))

		userCache[user?.user.id as string] = {
			...userCache[user?.user.id as string],
			ytMusicApi,
			ytMusicUser,
		}

		const track = await getSpotifyTrackFromId(null, trackId)

		if (track === null) throw new Error("Only Spotify Tracks are supported!")

		console.log(
			`${track.name} ${track.artists.map((artist) => artist.name).join(" ")}`
		)
		let content
		try {
			content = await ytMusicApi.searchSongs(
				`${track.name} ${track.artists[0].name}`
			)
		} catch (error) {
			console.error("Error searching for track on YouTube Music:", error)
			throw new Error("Error searching for track on YouTube Music")
		}
		// console.log(content[0])
		// content = content.filter(
		// 	(song) => song?.artist?.name === track.artists[0].name
		// )
		// console.log(content[0])
		if (content[0] === undefined) {
			throw new Error("Unable to find matching track on YouTube Music")
		}
		const videoId = content[0]?.videoId

		const youtubeTrack: ITrackDetail = {
			id: videoId,
		}

		const result = await ytMusicUser.addTracksToPlaylist(
			playlistId,
			youtubeTrack
		)
		console.log(result)
		if (!result) {
			console.log("FAIL")
			throw new Error("Unable to find matching track on YouTube Music")
		}
		console.log("added tracks to playlist")

		// Add YouTube URL
		// content.length === 0 ? ytList.push(null) : ytList.push(`https://${ytMusicUrl ? 'music.' : ''}youtube.com/watch?v=${content[0].videoId}`);
		// Return Result(s)

		return {
			success: true,
		}
	} catch (error) {
		console.log("ERR: ", error)
		return {
			success: false,
			message: error,
		}
	}
}

export const getAllTracksFromPlaylistClient = async (playlistId: string) => {
	const tracks = await getAllTracksFromPlaylist(null, playlistId)
	console.log(tracks)
	return tracks
}
