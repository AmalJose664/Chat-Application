import React, { useEffect, useRef, useState } from 'react'
import ChatMessageDiv from '../MessageComponents/ChatMessageDiv'
import { motion } from 'framer-motion';
import DashBoardICon from '../../../../assets/DashBoardICon';
import SendMessage from '../../../../assets/SendMessage'
import EmojiBox from '../MessageComponents/EmojiBox'
import { useGroupConnectStore } from '../../../../store/useGroupConnect';
import { toast } from 'sonner';
import File from '../../../../assets/File';

function MessageSendGroupComp({ enterSend, mesgTrans }) {

	const setGroupChatMessage = useGroupConnectStore(state => state.setGroupChatMessage)
	const sendGroupMessage = useGroupConnectStore(state => state.sendGroupMessage)

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
			if (typingTimerRef.current) {
				//sendTypeStatus('TYPE_STOP')
				clearTimeout(typingTimerRef.current)
				typingSentRef.current = false

			}
		};
	}, []);

	const toggleEmoji = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		if (!emojiOn && !showEmoji) {
			setEmojiOn(true)
			setShowEmoji(true)
		}
		else if (emojiOn && showEmoji) {
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
		const newText2 = text + emoji
		chatTextArea.current.innerText = newText2;
		setGroupChatMessage(newText2.trim());
	};
	const handleSendUi = () => {


		clearTimeout(typingTimerRef.current)
		typingSentRef.current = false
		sendGroupMessage()
	}

	return (

		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className={mesgTrans ? 'home-message-type transparent' : 'home-message-type'}>
			<div className="h-m-type-inner">
				<div className="home-message-emoji">
					<div className={showEmoji ? "h-m-emoji-inner emoji-shown" : "h-m-emoji-inner"} onClick={() => toggleEmoji()}>
						<DashBoardICon type='emoji' />
					</div>

				</div>
				<ChatMessageDiv enterSend={enterSend} closeOnEnter={handleSendUi} chatTextArea={chatTextArea} setChatMessage={setGroupChatMessage}/>
				

				<div className="home-message-file-or-send-btn" >
					<MessageOptions sendMessage={handleSendUi} chatTextArea={chatTextArea} />

				</div>
			</div>
			<div className={!showEmoji ? "h-m-emoji-contain-when-on " : "h-m-emoji-contain-when-on is-turned-on"}>
				{emojiOn && <EmojiBox handleEmojiClick={handleEmojiClick} isOn={emojiOn} />}
			</div>
		</motion.div>
	)
}

function MessageOptions({ sendMessage, chatTextArea }) {
	const fileRef = useRef(null)
	
	const [showFile, setShowFile] = useState({file:null, preview:null})
	const groupChatMessage = useGroupConnectStore(state => state.groupChatMessage)
	const sendFileText = useGroupConnectStore(state => state.sendFileText)

	const processFile = ()=>{
		fileRef.current.click()
	}

	const handleFileInput = (e)=>{
		
		let file = e.target.files[0]
		console.log(file.type)
		
		if (file.size > 80 * 1024 * 1024) {
			return toast.error("File size must be less than 80 MB.");
		}
		const reader = new FileReader()
		reader.onloadend = (e)=>{
			setShowFile({file, preview:e.target.result})
		}
		reader.readAsDataURL(file)
	}

	const removeImage = ()=>{
		setShowFile({})
		if(fileRef.current){
			return fileRef.current.value=""
		}
	}

	const sendData = ()=>{
		if(!showFile.file){
			sendMessage()
		}
		else{
			sendFileText(showFile.file, groupChatMessage)
			removeImage()
		}
		chatTextArea.current.innerText=""
	}

	useEffect(() => {
		return () => removeImage()
	},[])
	return (<div className={(groupChatMessage != "") || showFile.file ? "h-m-file-or-send-inner-selector not-empty-div" : "h-m-file-or-send-inner-selector"}>
		<div className="h-m-send-message" onClick={sendData}>
			<SendMessage />
		</div>
		<div className="h-m-file-selector" onClick={processFile}>
			<input type="file" hidden ref={fileRef} onChange={handleFileInput}/>
			<DashBoardICon type='file' />
		</div>
		{showFile.preview && <motion.div className={!/^image\/|video\/|audio\//.test(showFile.file.type) ? "file-show-group-home unknown" : "file-show-group-home"} initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2,  }}
		>
			<div className="file-close-group-home unknown" onClick={removeImage}>
				&times;
			</div>
			{showFile.file.type.startsWith("image/") && <img src={showFile.preview} alt="" />}
			{showFile.file.type.startsWith("video/") && <video controls controlsList="nodownload">
				<source src={showFile.preview} type={showFile.file.type} />
				Your browser does not support the video tag.
			</video> }
			{showFile.file.type.startsWith("audio/") && (<audio style={{ width: '200px' }} controls controlsList="nodownload">
				<source src={showFile.preview} type={showFile.file.type} />
				Your browser does not support the audio tag.
			</audio>)}
			
			{!/^image\/|video\/|audio\//.test(showFile.file.type) && <File color="white" />}
		</motion.div>}
	</div>)
}

export default MessageSendGroupComp
