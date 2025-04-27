import React, { useEffect, useRef, useState } from 'react'
import { useGroupStore } from '../../../../store/useGroupStore'
import { AnimatePresence, motion } from 'framer-motion'
import DashBoardICon from '../../../../assets/DashBoardICon'
import Lock from '../../../../assets/Lock'
import { useGroupConnectStore } from '../../../../store/useGroupConnect'
import Copybtn from '../../../../assets/Copybtn'
import { toast } from 'sonner';
import { getRandomColorInRange } from '../../../../lib/chatUtilities'
import GetUser from '../HomeUtils/GetUser'
import { useAuthStore } from '../../../../store/useAuthStore'

const SelectedGroup = React.memo(() => {
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	const setConnected = useGroupStore(state => state.setConnected)
	const connected = useGroupStore(state => state.connected)
	const clearGroupMessages = useGroupStore(state => state.clearGroupMessages)
	const deleteSocket = useGroupConnectStore(state => state.deleteSocket)

	const [onlineShow, setOnlineShow] = useState(false)

	const disconnect = () => { 
		setConnected(false); 
		deleteSocket(); 
		clearGroupMessages(); 
	}
	const creator = selectedGroup?.created_by.split("__")[1]
	const showGroupData = ()=>{
		toast.info(`Group Creator: ${selectedGroup?.created_by}, ${creator} `,{duration:800})
		toast.info(`Join_key: ${selectedGroup?.join_key|| "Join to know Details ..!"} `,{duration:800})
		toast.info(`Group_key: ${selectedGroup?.group_key|| "Join to know Details ..!"} `,{duration:800})
		toast.info(`Group Name: ${selectedGroup?.name}`,{duration:800})
	}
  return (

	  <AnimatePresence>
		  {selectedGroup && (<motion.div className="h-s-u-data for-groups" initial={{ opacity: 0, y: 20, }} animate={{ opacity: 1, y: 0, }} exit={{ opacity: 0, y: -20, }}
			  transition={{ duration: .3, ease: 'easeIn' }}>
			  <div className="home-select-user-image">
				  <div className='home-group-avatar' style={{ backgroundColor: selectedGroup.color || getRandomColorInRange(100,200) }}>{selectedGroup.initial}</div>
			  </div>
			  <div className="h-s-u-title for-groups" onClick={showGroupData}>
				  {selectedGroup.name} <Lock type={selectedGroup.is_private} size={20} color={selectedGroup.is_private ? "white" : "royalblue"} /> <br />
				  <ConnectedUsers seTab={() => setOnlineShow(!onlineShow)}/>
			  </div>
			  <div style={{fontSize:'13px',position:'absolute',top:0, left:'50%'}}>
				Group Creator : {creator}
			  </div>
			  <div className="home-online-users-wrapper">
				  <AnimatePresence>
					  {onlineShow && <OnlineUsers creator={selectedGroup.created_by} closeTab={()=>setOnlineShow(false)}/>}
				  </AnimatePresence>
			  </div>
			  {(connected && selectedGroup.is_private) && <p className='copy-btn-home-group' 
			  onClick={() => {
				navigator.clipboard.writeText(selectedGroup.join_key);
				toast.info("Key Copied")
				}
				}>Join to Group {selectedGroup.join_key} <Copybtn color='white' size={16}/></p>}
			  
			  <div className="disconnect-from-chat">
				  <div className="d-f-c-inner">
					{connected && <button onClick={disconnect}>
						Disconnect
					</button>}
					  
				  </div>
			  </div>
		  </motion.div>)}
	  </AnimatePresence>

  )
})

function ConnectedUsers({seTab}){
	const onlineUsers = useGroupStore(state => state.onlineUsers)

	
	return (<p onClick={seTab}><DashBoardICon type='profile' size={16} /> {onlineUsers.length} Users Connected </p>)
}





function OnlineUsers({ closeTab, creator }){
	const removeUser = useGroupConnectStore(state => state.removeUser)
	const tabRef = useRef(null)
	const [showUser, setShowUser] = useState(null)
	useEffect(() => {
		function handleClickOutside(event) {
			if (tabRef.current && !tabRef.current.contains(event.target)) {
				closeTab()
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [])

	const onlineUsers =useGroupStore(state => state.onlineUsers)
	const authUser = useAuthStore(state => state.authUser)
	const groupCreator = creator.split('__')[0]


	return (
		<motion.div className="home-group-online-users-tab" ref={tabRef} 
			initial={{ opacity: 0, y: -30, }} animate={{ opacity: 1, y: 0, }} exit={{ opacity: 0, y: -30, }}
			transition={{ duration: .59, ease: 'backInOut' }}
			>
			<div className="h-g-o-u-tab-inner">
				{onlineUsers.map((user, index) => {
					const data = user.split('__:__')
					const isMe = authUser.db_user._id == data[0]
					return (
					<div className="h-g-o-u-each" key={index}>
						<div className="h-g-o-u-each-inner" >
							<div className="home-online-user-image">
								<img src={data[1]} alt="" />
							</div>
							<div className="home-online-user-title">
								{ isMe  ? 'You' : data[2]} 
							</div>
							{!isMe && <div className="home-online-user-view">
								<button onClick={()=>{
									if (!isMe) setShowUser(data[0])
									}}>
									View
								</button>
							</div>}
							
							<div className="home-online-user-remove">
								{(!isMe && groupCreator == authUser.db_user.sqlite_id) && <button onClick={()=>removeUser(data[0])}>
									Kick {data[2]} {}
								</button>}
							</div>
						</div>
					</div>
				)} ) }
				{showUser && <GetUser group={true} id={showUser} closeFunct={()=>setShowUser(null)} />}
				
			</div>
		</motion.div>
	)

}

export default SelectedGroup
