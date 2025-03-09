import SpotifyLogin from "@/components/SpotifyLogin"
import TuneShiftLogo from "@/components/TuneShiftLogo"
import { auth } from "@/lib/auth"
import { ArrowRight } from "lucide-react"
import { headers } from "next/headers"
import React from "react"

export const metadata = {
	title: "Connect",
	description: "Connect your Spotify account to TuneShift",
}

const Connect = async () => {
	const user = await auth.api.getSession({ headers: await headers() })

	return (
		<div className='min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white'>
			<div className='container mx-auto px-4 py-16'>
				<div className='max-w-4xl mx-auto text-center'>
					<h1 className='text-5xl md:text-6xl font-bold mb-6'>Connect</h1>
					<div className='flex gap-4 items-center justify-center text-xl text-gray-300 mb-8 font-primary'>
						Connect your Spotify account to <TuneShiftLogo />
					</div>
				</div>
				<div className='flex justify-center space-x-24 mt-50'>
					<div className='flex flex-col items-center space-y-2'>
						<span className='text-green-500 font-bold'>Spotify</span>
						<div className='p-4 bg-white/10 rounded-2xl flex flex-col items-center space-y-4'>
							{user && (
								<div className='font-bold text-2xl'>{user.user.name}</div>
							)}
							<SpotifyLogin disabled={user !== null}>Connect</SpotifyLogin>
						</div>
					</div>
					<ArrowRight className='w-6 h-6 mt-20 text-gray-400' />
					<div className='flex flex-col items-center space-y-2'>
						<span className='text-red-500 font-bold'>Youtube</span>
						<div className='h-48 w-24 bg-white/10 rounded-2xl'></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Connect
