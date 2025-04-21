import React, { useState, useRef, useEffect, } from 'react'
import { motion } from 'framer-motion'
import DashBoardICon from '../../../../assets/DashBoardICon'
import { useChatStore } from '../../../../store/useChatStore'
import SendMessage from '../../../../assets/SendMessage'
import './MessageSendComp.css'
import EmojiBox from './EmojiBox'
import ChatMessageDiv from './ChatMessageDiv'
import { loadPreferences } from '../../../../lib/chatUtilities'





function MessageSendComp({ enterSend, mesgTrans } ) {


	const sendMessage = useChatStore(state => state.sendMessage)
	const sendTypeStatus = useChatStore(state => state.sendTypeStatus)
	const setChatMessage = useChatStore(state => state.setChatMessage);
	
	const typingTimerRef = useRef(null);
	const typingSentRef = useRef(false);
	
	const chatTextArea = useRef(null)
	const [emojiOn, setEmojiOn] = useState(false)
	const [showEmoji, setShowEmoji] = useState(false)
	const timerRef = useRef(null);


	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			if(typingTimerRef.current){
				sendTypeStatus('TYPE_STOP')
				clearTimeout(typingTimerRef.current)
				typingSentRef.current = false
				
			}
		};
	}, []);

	const toggleEmoji = ()=>{
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if(!emojiOn && !showEmoji){
			setEmojiOn(true)
			setShowEmoji(true)
		}
		else if(emojiOn && showEmoji){
			setShowEmoji(false)
			timerRef.current = setTimeout(() => {
				setEmojiOn(false)
			}, 500);
		}
		
	}

	const handleEmojiClick = (emojiObject) => {
		// const cursorPosition = window.getSelection().getRangeAt(0);
		
		 const emoji = emojiObject.emoji;
		 const text = chatTextArea.current.innerText;
	
		// const newText = text.substring(0, cursorPosition.startOffset) +
		// 	emoji +
		// 	text.substring(cursorPosition.startOffset);


		// optimize this one for cursor position
		const newText2 = text+emoji
		chatTextArea.current.innerText = newText2;
		setChatMessage(newText2.trim());
	};
	const handleSendUi = ()=>{

		sendTypeStatus('TYPE_STOP')
		clearTimeout(typingTimerRef.current)
		typingSentRef.current = false
		sendMessage()
		chatTextArea.current.innerText = ""
		setChatMessage("")
	}
  return (
	
	  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={mesgTrans ? 'home-message-type transparent' : 'home-message-type'}>
		<div className="h-m-type-inner">
			<div className="home-message-emoji">
				  <div className={showEmoji ? "h-m-emoji-inner emoji-shown" : "h-m-emoji-inner" } onClick={() => toggleEmoji()}>
					<DashBoardICon type='emoji'/>
				</div>
				
			</div>
			  <ChatMessageDiv enterSend={enterSend} closeOnEnter={handleSendUi} typeTimeRef={typingTimerRef} typeSentRef={typingSentRef} chatTextArea={chatTextArea} setChatMessage={setChatMessage} sendTypeStatus={sendTypeStatus}/>
			  
				
			  <div className="home-message-file-or-send-btn" onClick={handleSendUi}>
				<MessageOptions/>
				
			</div>
		</div>
		<div className={!showEmoji ? "h-m-emoji-contain-when-on " : "h-m-emoji-contain-when-on is-turned-on"}>
			  {emojiOn && <EmojiBox handleEmojiClick={handleEmojiClick} isOn={emojiOn} />}
		</div>
	</motion.div>
  )
}


function MessageOptions(){
	const chatMessage = useChatStore(state => state.chatMessage)

	return (<div className={chatMessage != "" ? "h-m-file-or-send-inner-selector not-empty-div" : "h-m-file-or-send-inner-selector"}>
		<div className="h-m-send-message">
			<SendMessage />
		</div>
		
	</div>)
}

export default MessageSendComp
