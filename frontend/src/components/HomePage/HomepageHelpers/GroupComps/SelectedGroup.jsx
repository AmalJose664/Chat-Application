import React from 'react'
import { useGroupStore } from '../../../../store/useGroupStore'
import { AnimatePresence, motion } from 'framer-motion'
import DashBoardICon from '../../../../assets/DashBoardICon'
import Lock from '../../../../assets/Lock'
import { useGroupConnectStore } from '../../../../store/useGroupConnect'
import Copybtn from '../../../../assets/Copybtn'
import { toast } from 'react-toastify'
import { getRandomColorInRange } from '../../../../lib/chatUtilities'

const SelectedGroup = React.memo(() => {
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	const setConnected = useGroupStore(state => state.setConnected)
	const connected = useGroupStore(state => state.connected)
	const clearGroupMessages = useGroupStore(state => state.clearGroupMessages)
	const deleteSocket = useGroupConnectStore(state => state.deleteSocket)
	
  return (

	  <AnimatePresence>
		  {selectedGroup && (<motion.div className="h-s-u-data" initial={{ opacity: 0, y: 20, }} animate={{ opacity: 1, y: 0, }} exit={{ opacity: 0, y: -20, }}
			  transition={{ duration: .3, ease: 'easeIn' }}>
			  <div className="home-select-user-image">
				  <div className='home-group-avatar' style={{ backgroundColor: selectedGroup.color || getRandomColorInRange(100,200) }}>{selectedGroup.initial}</div>
			  </div>
			  <div className="h-s-u-title for-groups">
				  {selectedGroup.name} <Lock type={selectedGroup.is_private} size={20} color={selectedGroup.is_private ? "white" : "royalblue"} /> <br />
				  <ConnectedUsers/>
			  </div>
			  {(connected && selectedGroup.is_private) && <p className='copy-btn-home-group' 
			  onClick={() => {
				navigator.clipboard.writeText(selectedGroup.join_key);
				toast.info("Key Copied")
				}
				}>Join to Group {selectedGroup.join_key} <Copybtn color='white' size={16}/></p>}
			  
			  <div className="disconnect-from-chat">
				  <div className="d-f-c-inner">
					{connected && <button onClick={() => { setConnected(false); deleteSocket(); clearGroupMessages(); }}>
						Disconnect
					</button>}
					  
				  </div>
			  </div>
		  </motion.div>)}
	  </AnimatePresence>

  )
})

function ConnectedUsers(){
	const onlineUsers = useGroupStore(state => state.onlineUsers)
	return (<p><DashBoardICon type='profile' size={16} /> {onlineUsers.length} Users Connected </p>)
}

export default SelectedGroup
