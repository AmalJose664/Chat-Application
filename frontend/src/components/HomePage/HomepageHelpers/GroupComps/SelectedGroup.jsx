import React from 'react'
import { useGroupStore } from '../../../../store/useGroupStore'
import { motion } from 'framer-motion'
import DashBoardICon from '../../../../assets/DashBoardICon'
import Lock from '../../../../assets/Lock'

const SelectedGroup = () => {
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	const setConnected = useGroupStore(state => state.setConnected)
  return (

	  selectedGroup && (<motion.div className="h-s-u-data" initial={{ opacity: 0, y: 20, }} animate={{ opacity: 1, y: 0, }}
		  transition={{ duration: .3, ease: 'easeIn' }}>
		<div className="home-select-user-image">
			<div className='home-group-avatar' style={{ backgroundColor: selectedGroup.color }}>{selectedGroup.initial}</div>
		</div>
		<div className="h-s-u-title for-groups">
			  {selectedGroup.name} <Lock type={selectedGroup.is_private} size={20} color={selectedGroup.is_private ? "white" : "royalblue"} /> <br />
			<p><DashBoardICon type='profile' size={16}/> {selectedGroup.count} Users Connected </p> 
		</div>
		<div className="disconnect-from-chat">
			<div className="d-f-c-inner">
				<button>
					Disconnect
				</button>
			</div>
		</div>
	  </motion.div>)

  )
}

export default SelectedGroup
