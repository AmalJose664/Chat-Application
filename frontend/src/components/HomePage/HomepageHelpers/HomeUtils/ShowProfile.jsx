import React from 'react'
import './ShowProfile.css'
import { useSpecialStore } from '../../../../store/specialStore'
import { AnimatePresence, motion } from 'framer-motion'

const ShowProfile = () => {
	const userData = useSpecialStore(state => state.userData)
	const setUserPictData = useSpecialStore(state => state.setUserPictData) 
	return (
		< motion.div className='list-users-show-user-pic' initial={{ opacity: 0, x: -220, scale: 0.7 }} animate={{ opacity: 1, x: 0, scale: 1 }} 
			transition={{ duration: 0.23, ease:'anticipate'}}>
			<div className="l-u-s-u-p-inner">
				<span>{userData.user_name}</span> <span onClick={() => setUserPictData(null)}>&times;</span>
				<div className="l-u-s-u-p-content">
					<img src={userData.profile_picture} alt="" />
				</div>
			</div>
		</motion.div>
	)
}

export default ShowProfile
