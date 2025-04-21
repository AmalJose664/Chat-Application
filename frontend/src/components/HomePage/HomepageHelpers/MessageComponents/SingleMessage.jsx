import React, { useState } from 'react'
import { useAuthStore } from '../../../../store/useAuthStore';
import { getTime } from '../../../../lib/timefilter';
import DashBoardICon from '../../../../assets/DashBoardICon'
import ReadReceipts from '../../../../assets/ReadReceipts';
import { motion } from 'framer-motion';
import './SingleMessage.css'
import { toast } from 'sonner';
import Copybtn from '../../../../assets/Copybtn'
import { userDataStore } from '../../../../store/userDataStore';
import Search from '../../../../assets/Search'
import GetMessageDetails from './GetMessageDetails';
import { useChatStore } from '../../../../store/useChatStore';
import Trash from '../../../../assets/Trash'
import { getContrastColor } from '../../../../lib/chatUtilities';
import { senderFind } from '../../../../lib/lastMessageFilter';


export const SingleMessage = React.memo(({ message, i, customPrefrns }) =>{
	
	
	const [smallBoxActive, setSmallBoxActive] = useState(false)
	const [detailBox, setDetailBox] = useState(false)
	const { authUser } = useAuthStore()
	let sent 
	if(!message.s){
		sent = senderFind(message.c_id, authUser.db_user._id)
	}else{
		sent = message.s == authUser.db_user._id
	}

	

	const color = !sent ? customPrefrns.chatColor.s : customPrefrns.chatColor.r // message color bg
	const reciMsgClr = getContrastColor(color) // for color inversion
	
	return (
	<motion.div key={i} className={!sent ? "message__h type-receive" : "message__h type-sent"}
		initial={{ opacity: 0 , x: sent ? 28 : -28}} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, delay: message.c_id ? i/20 : 0 }}
			style={{ borderRadius: `${customPrefrns.messageCrnr}px` }}
	>
			<div className={detailBox ? "message__wrapper hide" : "message__wrapper"} 
				style={{ background: color, borderRadius: `${customPrefrns.messageCrnr}px` }}
			>
			<div className="message__in">
					<div className="message__content" style={{ color: reciMsgClr, fontSize: `${customPrefrns.fontSize}px` }}>
					{message.c}
				</div>
					<span className="message__time" style={{ color: reciMsgClr }}>
					{getTime(message.t)}
				</span>
				{message.s == authUser.db_user._id ? <span className='message__status'>
					<ReadReceipts status={message.sa} dColor={customPrefrns.tickColor.d} rColor={customPrefrns.tickColor.r}/>
				</span> : ""}
				
			</div>
			<div className="message__options">
				<div onClick={()=>setSmallBoxActive(!smallBoxActive)} onMouseLeave={()=>setSmallBoxActive(false)} className="m__option" >
						<DashBoardICon type='dots' color={reciMsgClr || 'white'} />
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





