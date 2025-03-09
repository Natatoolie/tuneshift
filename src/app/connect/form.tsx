/* eslint-disable @next/next/no-img-element */
"use client"
import { verifyYoutubeHeaders } from "@/actions/ytmusic"
import SpotifyLogin from "@/components/SpotifyLogin"
import TuneShiftLogo from "@/components/TuneShiftLogo"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

import React, { useActionState, useEffect } from "react"
import { toast } from "sonner"

const Form = () => {
	const { data } = authClient.useSession()

	const router = useRouter()

	const user = data && data.user

	const [state, formAction, pending] = useActionState(verifyYoutubeHeaders, {
		message: "",
		success: true,
	})

	useEffect(() => {
		if (state.message === "") return
		toast(state.success ? "Success!" : "An error has occured...", {
			description: <p className='text-background/60'>{state.message}</p>,
		})
		if (state.success) {
			router.push("/")
		}
	}, [state])

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
						<div className='p-12 bg-white/10 rounded-2xl flex flex-col items-center space-y-8'>
							{user && (
								<div className='flex flex-col items-center'>
									<img
										alt='image'
										src={user.image!}
										className='w-15 h-15 rounded-full'
									/>
									<div className='font-bold text-2xl'>{user.name}</div>
									<div className='text-sm text-background/80'>Connected</div>
								</div>
							)}
							<SpotifyLogin disableClick={true} disabled={data !== null}>
								Connect
							</SpotifyLogin>
						</div>
					</div>
					<ArrowRight className='w-6 h-6 mt-20 text-gray-400' />
					<div className='flex flex-col items-center space-y-2'>
						<span className='text-red-500 font-bold'>Youtube</span>
						<form
							action={formAction}
							className='w-128 h-64 bg-white/10 rounded-2xl p-4 flex flex-col items-center'
						>
							<textarea
								disabled={user === null}
								className='w-full h-[60%] resize-none outline-none'
								name='headers'
								id=''
								placeholder={
									user ? "Enter headers here..." : "Connect to spotify first..."
								}
							/>
							<button
								disabled={user === null}
								className={cn(
									"bg-red-600 w-36 translate-y-1/2 hover:bg-red-500 px-6 py-2 rounded-full font-semibold transition",
									pending && "cursor-not-allowed opacity-50"
								)}
							>
								Verify
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Form
