import React, { useState } from 'react'
import { useAuthStore } from '../../../../store/useAuthStore';
import { getTime } from '../../../../lib/timefilter';
import DashBoardICon from '../../../../assets/DashBoardICon'
import ReadReceipts from '../../../../assets/ReadReceipts';
import { motion } from 'framer-motion';
import './SingleMessage.css'
import { toast } from 'react-toastify';
import Copybtn from '../../../../assets/Copybtn'
import { userDataStore } from '../../../../store/userDataStore';
import Search from '../../../../assets/Search'
import GetMessageDetails from './GetMessageDetails';
import { useChatStore } from '../../../../store/useChatStore';
import Trash from '../../../../assets/Trash'
import { getContrastColor } from '../../../../lib/chatUtilities';

export const SingleMessage = React.memo(({ message, i, customPrefrns }) =>{
	
	
	const [smallBoxActive, setSmallBoxActive] = useState(false)
	const [detailBox, setDetailBox] = useState(false)
	const { authUser } = useAuthStore()
	const receive = message.s == authUser.db_user._id
	
	return (
	<motion.div key={i} className={message.r == authUser.db_user._id ? "message__h type-receive" : "message__h type-sent"}
		initial={{ opacity: 0 , x: receive ? 28 : -28}} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, delay: message.c_id ? i/20 : 0 }}
			style={{ borderRadius: `${customPrefrns.messageCrnr}px` }}
	>
			<div className={detailBox ? "message__wrapper hide" : "message__wrapper hhhhhhh"} 
				style={{ background: customPrefrns.chatColor.s, borderRadius: `${customPrefrns.messageCrnr}px` }}
			>
			<div className="message__in">
					<div className="message__content" style={{ color: getContrastColor(customPrefrns.chatColor.s), fontSize: `${customPrefrns.fontSize}px` }}>
					{message.c}
				</div>
					<span className="message__time" style={{ color: getContrastColor(customPrefrns.chatColor.s) }}>
					{getTime(message.t)}
				</span>
				{message.s == authUser.db_user._id ? <span className='message__status'>
					<ReadReceipts status={message.sa} dColor={customPrefrns.tickColor.d} rColor={customPrefrns.tickColor.r}/>
				</span> : ""}
				
			</div>
			<div className="message__options">
				<div onClick={()=>setSmallBoxActive(!smallBoxActive)} onMouseLeave={()=>setSmallBoxActive(false)} className="m__option" >
					<DashBoardICon type='dots' color='grey' />
						{smallBoxActive && <SmallBox m_id={message._id} message={message.c} time={message.t} togleDetailBox={setDetailBox} side={message.r == authUser.db_user._id}/>}
				</div>
			</div>
			</div>{detailBox && <GetMessageDetails togleDetailBox={setDetailBox} />}
	</motion.div>
  )
})

export function SmallBox({message, side: ourSide, m_id, togleDetailBox, time}){

	const deleteMessageStore = useChatStore(state => state.deleteMessageStore)
	const setMessageId = userDataStore(state => state.setMessageId)
	const setMessageIdUi = (id)=>{
		setMessageId(id)
		togleDetailBox(true)
	}
	const deleteMessage = ()=>{
		deleteMessageStore(time, m_id )
	}
	return(
		<motion.div className="message-space-message-small-box" initial={{ opacity: 0, x: ourSide ? -20 : 20, y: -20 }}  animate={{ opacity: 1, x: 0 ,y:0 }} transition={{ duration: 0.1 }}>
			<div className="m-s-m-s-b-inner">
				<div className="m-s-m-s-b-list">
					<div className="small-options-list-box" onClick={(e) => { navigator.clipboard.writeText(message); toast.info("Message Copied") }}> 
						<Copybtn size={16} color='white' />
						<p > Copy</p>
					</div>
					<div className="small-options-list-box" onClick={()=>setMessageIdUi(m_id)}>
						<Search size={16} color='white' />
						<p> Details</p>
					</div>
					{!ourSide && <div className="small-options-list-box deltebtn" onClick={deleteMessage}>
						<Trash size={16} color='white' />
						<p> Delete</p>
					</div>}
				</div>
			</div>
		</motion.div>
	)
} 





