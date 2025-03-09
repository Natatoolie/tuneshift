import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { PrismaClient } from "@prisma/client"

const mongo = new MongoClient(process.env.DATABASE_URL!).db()
export const prisma = new PrismaClient()
export const auth = betterAuth({
	database: mongodbAdapter(mongo),
	socialProviders: {
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID || "",
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
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
