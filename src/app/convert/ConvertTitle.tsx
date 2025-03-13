"use client"
import { ArrowRight, Music, Youtube } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

const ConvertTitle = () => {
	return (
		<div className='max-w-4xl mx-auto text-center'>
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className='text-5xl md:text-6xl font-bold mb-6'
			>
				Convert
			</motion.h1>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className='flex gap-4 items-center justify-center text-xl text-gray-300 mb-8 font-primary'
			>
				<div className='flex items-center gap-2 text-green-500'>
					<Music className='w-6 h-6' />
					<span>Spotify</span>
				</div>
				<ArrowRight className='w-6 h-6 text-gray-400' />
				<div className='flex items-center gap-2 text-red-500'>
					<Youtube className='w-6 h-6' />
					<span>YouTube</span>
				</div>
			</motion.div>
		</div>
	)
}

export default ConvertTitle
