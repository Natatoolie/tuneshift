// import { verifyYoutubeHeaders } from "@/actions/ytmusic"
// import SpotifyLogin from "@/components/SpotifyLogin"
// import TuneShiftLogo from "@/components/TuneShiftLogo"

// import { authClient } from "@/lib/auth-client"
// import { parseHeadersToJSON } from "@/lib/utils"
// import { ArrowRight } from "lucide-react"
// import { headers } from "next/headers"
import React from "react"
import ConnectForm from "./form"
import { auth, userSession, verifyBothLogins } from "@/lib/auth"
import { headers } from "next/headers"
import { verifyYoutubeCookie, verifyYoutubeHeaders } from "@/actions/ytmusic"
import { redirect } from "next/navigation"

export const metadata = {
	title: "Connect",
	description: "Connect your Spotify account to TuneShift",
}

const Connect = async () => {
	const hasAccess = await verifyBothLogins()
	console.log(hasAccess)
	if (hasAccess.success === true) redirect("/convert")

	return <ConnectForm />
}

export default Connect
