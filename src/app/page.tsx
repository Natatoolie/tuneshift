import SpotifyLogin from "@/components/SpotifyLogin"
import TuneShiftLogo from "@/components/TuneShiftLogo"

import {
	ArrowRight,
	CheckCircle,
	Clock,
	Music,
	Share2,
	Youtube,
} from "lucide-react"
import Link from "next/link"
import React from "react"

const Home = () => {
	return (
		<div className='min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white'>
			{/* Hero Section */}
			<div className='container mx-auto px-4 py-16'>
				<nav className='flex justify-between items-center mb-16'>
					<TuneShiftLogo />
					{/* <button className='bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full font-semibold transition'>
						Get Started
					</button> */}
				</nav>

				<div className='max-w-4xl mx-auto text-center'>
					<h1 className='text-5xl md:text-6xl font-bold mb-6'>
						Transform Your
						<span className='text-green-500'> Spotify</span> Playlists to
						<span className='text-red-500'> YouTube</span>
					</h1>
					<p className='text-xl text-gray-300 mb-8 font-primary'>
						Seamlessly convert your favorite Spotify playlists into YouTube
						music videos with just one click.
					</p>
					<div className='flex justify-center items-center gap-4 mb-16 font-bold cursor-default'>
						<div className='flex items-center gap-2 text-green-500'>
							<Music className='w-6 h-6' />
							<span>Spotify</span>
						</div>
						<ArrowRight className='w-6 h-6 text-gray-400' />
						<div className='flex items-center gap-2 text-red-500'>
							<Youtube className='w-6 h-6' />
							<span>YouTube</span>
						</div>
					</div>

					<div className=' p-8 rounded-2xl backdrop-blur-sm'>
						<div className='flex flex-col md:flex-row justify-center gap-8'>
							{/* <input
								type='text'
								placeholder='Paste your Spotify playlist link'
								className='bg-zinc-700 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-96'
							/> */}
							<Link href={"/connect"}>
								<SpotifyLogin>Get Started!</SpotifyLogin>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className='container mx-auto px-4 py-16'>
				<div className='grid md:grid-cols-3 gap-8'>
					<div className='bg-zinc-800/30 p-6 rounded-xl'>
						<Clock className='w-12 h-12 text-green-500 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>Quick Conversion</h3>
						<p className='text-gray-400'>
							Convert entire playlists in seconds with our advanced matching
							algorithm.
						</p>
					</div>
					<div className='bg-zinc-800/30 p-6 rounded-xl'>
						<Share2 className='w-12 h-12 text-green-500 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>Easy Sharing</h3>
						<p className='text-gray-400'>
							Share your converted playlists with friends across platforms.
						</p>
					</div>
					<div className='bg-zinc-800/30 p-6 rounded-xl'>
						<CheckCircle className='w-12 h-12 text-green-500 mb-4' />
						<h3 className='text-xl font-semibold mb-2'>High Accuracy</h3>
						<p className='text-gray-400'>
							Get precise matches with our smart track identification system.
						</p>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className='container mx-auto px-4 py-8 text-center text-gray-400'>
				<p>© 2024 TuneShift. All rights reserved.</p>
			</footer>
		</div>
	)
}

export default Home
