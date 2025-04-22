import React, {  useEffect, useRef, useState } from 'react'
import { userDataStore } from '../../../store/userDataStore.js'
import DashBoardICon from '../../../assets/DashBoardICon.jsx'
import './SelectesUserTitle.css'
import { useChatStore } from '../../../store/useChatStore.js'
import { useSpecialStore } from '../../../store/specialStore.js'
import { motion } from 'framer-motion'
import GetUser from './HomeUtils/GetUser.jsx'
import { Link } from 'react-router-dom'

function SelectedUserTitle() {
	const selectedUser = userDataStore(state => state.selectedUser);
	const setMessageRead = useSpecialStore(state => state.setMessageRead)

	const selectedChatTyping = useSpecialStore(state => state.selectedChatTyping)
	const selectedChatOnline = useSpecialStore(state => state.selectedChatOnline)

	const loadSelectedUserMessages = useChatStore(state => state.loadSelectedUserMessages);
	console.log("From selectusertitle");
	
	const [showExtras ,setShowExtras] = useState(false)
	const [showUserDetails, setShowUserDetails] = useState(false)
	const dotRef = useRef(null)
	return (
	<div className='home-select-user-cont'>
			<div className="home-selected-user-wrapper">
				
			{selectedUser && <> 
			<motion.div className="h-s-u-data" initial={{ opacity: 0, y: 20,  }} animate={{ opacity: 1, y: 0,  }} 
			transition={{ duration: .3, ease:'easeIn'}}>
				<div className="home-select-user-image">
					<img src={selectedUser.pic} alt="" onClick={setMessageRead}/>
				</div>
				<div className="h-s-u-title" onClick={()=>setShowUserDetails(true)}>
					{selectedUser.user_name} <br />
						{selectedChatTyping ? <l-leapfrog
							size="20"
							speed="2"
							color="white"
						></l-leapfrog> : <p>{selectedChatOnline ? "Online" : "Seen Recently.."}</p>}
					
				</div>
			</motion.div>
			
			<motion.div className={showExtras ? "h-s-u-extra selected" : "h-s-u-extra"} ref={dotRef} onClick={()=> setShowExtras(!showExtras)}
						initial={{ opacity: 0, y: 10, }} animate={{ opacity: 1, y: 0, }}
						transition={{ duration: .2, ease: 'easeIn' }}
				>
				<DashBoardICon type='dots' size={26}/>
					{showExtras && <Extras outRef={dotRef} onClose={() => setShowExtras(false)} showDetails={()=>setShowUserDetails(true)}/>}
			</motion.div> </>}
		</div>
		{showUserDetails && <GetUser closeFunct={()=>setShowUserDetails(false)} status={selectedChatOnline} id={selectedUser._id}/>}
	</div>
  )
}

function Extras({ outRef, onClose, showDetails }){
	const popupRef = useRef(null)
	const clearSelectedChatUser = useChatStore(state => state.clearSelectedChatUser) 
	const clearSelectedUserDataStore = userDataStore(state => state.clearSelectedUserDataStore)
	const setMakeConnection = useChatStore((state) => state.setMakeConnection);
	const deleteSocket = useChatStore((state) => state.deleteSocket);
	const getSocketDetails = useChatStore(state => state.getSocketDetails)
	useEffect(()=>{
		function handleClickOutside(event) {

			if (popupRef.current && !popupRef.current.contains(event.target) && !outRef.current.contains(event.target)) {
				onClose();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose])
	
	const clearUserSelected = async ()=>{
		await deleteSocket()
		clearSelectedUserDataStore()
		clearSelectedChatUser()
	}
	return (
		<motion.div className="h-sut-extras-box" ref={popupRef} initial={{ opacity: 0,x:20 ,y: -20 }} animate={{ opacity: 1,x:0, y: 0 }} transition={{ duration: 0.2 }}>
			<div className="h-sut-extras-inner">
				<div className="h-s-extra-box-contents">
					{getSocketDetails() != 1 && <div className='h-s-extrabox-each' onClick={async() => { await deleteSocket(); setMakeConnection(true) }}>
						Re Connect
					</div>}
					<div className="h-s-extrabox-each" onClick={clearUserSelected}>
						Close Chat
					</div>
					<div className="h-s-extrabox-each" onClick={showDetails}>
						Get Details
					</div>
					<Link to={'/settings'} className="h-s-extrabox-each" style={{marginTop:'30px'}}>
						Change Background
					</Link>
				</div>
			</div>
		</motion.div>
	)
}

export default SelectedUserTitle
