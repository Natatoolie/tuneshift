import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

const zodParseHeaders = z.object({
	Accept: z.literal("*/*"),
	AcceptLanguage: z.literal("en-US,en;q=0.5"),
	ContentType: z.literal("application/json"),
	Cookie: z.string(),
	UserAgent: z.literal(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0"
	),
	"X-Goog-AuthUser": z.string(),
	// "X-Goog-Visitor-Id": z.string(),
	origin: z.literal("https://music.youtube.com"),
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseHeadersToJSON(
	rawHeaders: string
): Record<string, string> | undefined {
	const headersArray = rawHeaders
		.split("\n")
		.filter((header) => header.trim() !== "")
	const headersObject: Record<string, string> = {}

	headersArray.forEach((header) => {
		const [key, ...valueParts] = header.split(":")
		headersObject[key.trim().replace(/'/g, "")] = valueParts.join(":").trim()
	})

	headersObject["Accept"] = "*/*"
	headersObject["AcceptLanguage"] = "en-US,en;q=0.5"
	headersObject["ContentType"] = "application/json"
	headersObject["UserAgent"] =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0"
	headersObject["origin"] = "https://music.youtube.com"
	const finalheaders = zodParseHeaders.safeParse(headersObject)

	return finalheaders.data
}
