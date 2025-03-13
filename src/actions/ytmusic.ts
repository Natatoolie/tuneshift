"use server"

import { auth, prisma, userSession } from "@/lib/auth"
import { parseHeadersToJSON } from "@/lib/utils"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import YouTubeMusic from "youtube-music-ts-api"

export async function verifyYoutubeCookie(cookie: string) {
	const YTMusicSingleton = new YouTubeMusic()

	try {
		const e = await YTMusicSingleton.authenticate(cookie)
		await e.getLibraryPlaylists()

		return {
			success: true,
			message: "Valid cookie.",
		}
	} catch (error) {
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

	const YTMusicSingleton = new YouTubeMusic()

	try {
		const acc = await YTMusicSingleton.authenticate(parsedHeaders.Cookie)
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
	} catch (error) {
		return {
			success: false,
			message: "Invalid cookie.",
		}
	}
}
