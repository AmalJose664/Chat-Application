import React, { useEffect, useRef } from 'react'
import {motion} from 'framer-motion'
import { useGroupStore } from '../../../../store/useGroupStore';
import { SingleNewMessages } from '../MessageComponents/SingleNewMessages';
import MessageSendGroupComp from './MessageSendGroupComp';
import { toast } from 'sonner';
import { convertStringToCss, loadPreferences } from '../../../../lib/chatUtilities';

function GroupMessageComp() {
	const messagesEndRef = useRef(null);
	const setGroupMessages = useGroupStore(state => state.setGroupMessages)
	const setScrollRef = useGroupStore(state => state.setScrollRef)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	useEffect(()=>{
		const timer = setTimeout(() => setScrollRef(scrollToBottom),500)
		const toastTimer = setTimeout(() => toast.warning("Group will be deleted after everyone Exits !!", { duration: 2500 }), 1000)
		toast.warning("Group messages are not persistent !", {duration:3500})
		
		return () => {
			clearTimeout(timer)
			clearTimeout(toastTimer)
		}
	},[])
	const customPrefrns = loadPreferences()
  return (
	  <motion.div className='h-m' style={{ ...convertStringToCss(customPrefrns.customBackground) }} exit={{ opacity: 0, y: 10 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }} >

		  <div className="home-messages" >
			  <div className='wrapper'>

				  <NewMessages customPrefrns={customPrefrns} />
				  <div className="scroll__to_" ref={messagesEndRef}>
				  </div>
			  </div>

		  </div>
		  <MessageSendGroupComp enterSend={customPrefrns.enterSend} mesgTrans={customPrefrns.mesgTrans}/>
	  </motion.div>
  )
}

const NewMessages = React.memo(({ customPrefrns }) => {
	
	const groupMessages = useGroupStore(state => state.groupMessages)

 	return (
		<>
			{groupMessages.length != 0 ? groupMessages.map((message, i) => (
				<SingleNewMessages customPrefrns={customPrefrns} message={message} key={i} i={i} isGroupMessage={true}/>
			)) : 
				<p style={{ textAlign: 'center' }}>Say Hi and Start a Chat !! </p>
			}
		</>
		
	)
})

export default GroupMessageComp
