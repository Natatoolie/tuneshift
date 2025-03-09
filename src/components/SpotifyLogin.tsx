"use client"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import React from "react"

const SpotifyLogin = ({
	children,

	disabled = false,
}: {
	children?: React.ReactNode

	disabled?: boolean
}) => {
	function signIn() {
		// if (enableSignin === true) {
		authClient.signIn.social({
			provider: "spotify",
			callbackURL: "/connect",
			errorCallbackURL: "/error",
		})
		// }
	}
	return (
		<button
			onClick={signIn}
			disabled={disabled}
			className={cn(
				" bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2",
				disabled && "cursor-not-allowed opacity-50"
			)}
		>
			{disabled ? "Connected to Spotify" : children}

			<Sparkles className='w-5 h-5' />
		</button>
	)
}

export default SpotifyLogin
