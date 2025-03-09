import React from "react"

const Navbar = () => {
	return (
		<div className='w-full h-16 bg-gray-800 text-white cursor-default font-[var(--font-geist-sans)]'>
			<div className='flex items-center h-full px-4'>
				<h1 className='text-3xl logo-text'>
					Syncify <span className='logo-text-music'>Music</span>
				</h1>
			</div>
		</div>
	)
}

export default Navbar
