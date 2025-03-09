"use server"

import { auth, prisma } from "@/lib/auth"
import { parseHeadersToJSON } from "@/lib/utils"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import YouTubeMusic from "youtube-music-ts-api"

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
		await YTMusicSingleton.authenticate(parsedHeaders.Cookie)
		const user = await auth.api.getSession({ headers: await headers() })
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
		console.log(error)
		return {
			success: false,
			message: "Invalid cookie.",
		}
	}
}
