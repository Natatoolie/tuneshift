// import { verifyYoutubeHeaders } from "@/actions/ytmusic"
// import SpotifyLogin from "@/components/SpotifyLogin"
// import TuneShiftLogo from "@/components/TuneShiftLogo"

// import { authClient } from "@/lib/auth-client"
// import { parseHeadersToJSON } from "@/lib/utils"
// import { ArrowRight } from "lucide-react"
// import { headers } from "next/headers"
import React from "react"
import ConnectForm from "./form"

export const metadata = {
	title: "Connect",
	description: "Connect your Spotify account to TuneShift",
}

const Connect = () => {
	return <ConnectForm />
}

export default Connect
