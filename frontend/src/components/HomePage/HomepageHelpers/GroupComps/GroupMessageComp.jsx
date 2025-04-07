import React, { useEffect, useRef } from 'react'
import {motion} from 'framer-motion'
import { useGroupStore } from '../../../../store/useGroupStore';
import { SingleNewMessages } from '../MessageComponents/SingleNewMessages';
import MessageSendGroupComp from './MessageSendGroupComp';
import { toast } from 'react-toastify';

function GroupMessageComp() {
	const messagesEndRef = useRef(null);
	const setGroupMessages = useGroupStore(state => state.setGroupMessages)
	const setScrollRef = useGroupStore(state => state.setScrollRef)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(()=>{
		const timer = setTimeout(() => setScrollRef(scrollToBottom),500)
		toast.info("Group messages are not persistent !", {autoClose:3500})
		toast.info("Group will be deleted after everyone Exits !!", { autoClose: 2500,delay:1000 })
		return () => {
			clearTimeout(timer)

		}
	},[])

  return (
	  <div className='h-m' >

		  <motion.div className="home-messages" exit={{ opacity: 0, y: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} >
			  <div className='wrapper'>

				  <NewMessages />
				  <div className="scroll__to_" ref={messagesEndRef}>
				  </div>
			  </div>

		  </motion.div>
		  <MessageSendGroupComp/>
	  </div>
  )
}

const NewMessages = React.memo(() => {
	const groupMessages = useGroupStore(state => state.groupMessages)

 	return (
		<>
			{groupMessages.length != 0 ? groupMessages.map((message, i) => (
				<SingleNewMessages message={message} key={i} i={i} isGroupMessage={true}/>
			)) : 
				<p style={{ textAlign: 'center' }}>Say Hi and Start a Chat !! </p>
			}
		</>
		
	)
})

export default GroupMessageComp
