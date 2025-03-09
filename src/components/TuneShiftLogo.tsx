import { Music } from "lucide-react"
import React from "react"

const TuneShiftLogo = () => {
	return (
		<div className='flex items-center gap-2'>
			<Music className='w-8 h-8 text-green-500' />
			<span className='text-xl font-bold'>TuneShift</span>
		</div>
	)
}

export default TuneShiftLogo
