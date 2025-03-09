import { betterAuth } from "better-auth"

import { PrismaClient } from "@prisma/client"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const prisma = new MongoClient(process.env.DATABASE_URL!).db()
export const auth = betterAuth({
	database: mongodbAdapter(prisma),
	socialProviders: {
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID || "",
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
		},
	},
})
