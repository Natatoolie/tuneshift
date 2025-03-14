import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { PrismaClient } from "@prisma/client"
import { headers } from "next/headers"
import { verifyYoutubeCookie } from "@/actions/ytmusic"
import { redirect } from "next/navigation"
import { RedoIcon } from "lucide-react"

const mongo = new MongoClient(process.env.DATABASE_URL!).db()
export const prisma = new PrismaClient()
export const auth = betterAuth({
	database: mongodbAdapter(mongo),
	socialProviders: {
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID || "",
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
			scope: ["user-read-email, user-library-read", "playlist-read-private"],

			mapProfileToUser: () => {
				return { youtubeId: "test" }
			},
		},
	},
	emailAndPassword: {
		enabled: false,
	},
	user: {
		additionalFields: {
			youtubeId: {
				type: "string",
				required: true,
				fieldName: "youtubeId",
			},
		},
	},
})

export const userSession = async () => {
	return auth.api.getSession({ headers: await headers() })
}

export const getUserAccount = async () => {
	const session = await userSession()

	const account = await auth.options.database({}).findOne({
		model: "account",
		where: [
			{
				field: "userId",
				operator: "eq",
				value: session?.user.id as string,
			},
		],
	})
	return account
}

export const verifyBothLogins = async (callback: void) => {
	const user = await userSession()
	if (!user) return { success: false, message: "Not logged in" }
	const youtubeCookie = user?.user.youtubeId
	const userId = user?.user.id as string

	const expiresAt = await auth.options.database({}).findOne({
		model: "account",
		where: [
			{
				field: "userId",
				operator: "eq",
				value: userId,
			},
		],
		select: ["accessTokenExpiresAt"],
	})
	// console.log(expiresAt)

	// console.log(expiresAt?.userId, user?.user.id)
	// console.log(expiresAt?.userId === user?.user.id)
	// console.log(typeof expiresAt?.userId, typeof user?.user.id)
	// console.log(expiresAt)
	if (expiresAt === null) {
		return { success: false, message: "Not logged in" }
	}

	if (expiresAt.accessTokenExpiresAt!.getTime() < Date.now()) {
		await auth.api.revokeSessions({ headers: await headers() })
		return { success: false, message: "Access token expired" }
	}

	if (!youtubeCookie) {
		return { success: false, message: "Invalid cookie" }
	}

	const validHeadersResponse = await verifyYoutubeCookie(youtubeCookie)
	if (validHeadersResponse.success === false) {
		return { success: false, message: "Invalid youtube headers." }
	}
	return { success: true, message: "" }
}
