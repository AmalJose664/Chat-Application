import React, { useEffect, useRef, useState } from "react"
import { useAuthStore } from "../../../../store/useAuthStore"
import { motion, AnimatePresence } from "framer-motion"
import { getTime } from "../../../../lib/timefilter"
import ReadReceipts from "../../../../assets/ReadReceipts"
import DashBoardICon from "../../../../assets/DashBoardICon"
import { SmallBox } from "./SingleMessage"
import GetMessageDetails from "./GetMessageDetails"
import '../GroupComps/SingleNewMsgGrp.css'
import GetUser from "../HomeUtils/GetUser"
import Download from "../../../../assets/Download"
import File from "../../../../assets/File"
import { getContrastColor, getFileSize } from "../../../../lib/chatUtilities"

// this component only displays new messages => messgaes that are received in realtime

export const SingleNewMessages = React.memo(({ message, i, isGroupMessage = false, customPrefrns }) => {

	const [smallBoxActive, setSmallBoxActive] = useState(false)
	const [showUser, setShowUser] = useState(false)
	const [detailBox, setDetailBox] = useState(false)
	const { authUser } = useAuthStore()
	const isSentMsg = message.s == authUser.db_user._id

	

	useEffect(()=>{
		return ()=>{
			if (message.c && message.type == "CHAT_FILE_EVENT") {
				URL.revokeObjectURL(message.c)
			}
		}
	},[])
	const color = !isSentMsg ? customPrefrns.chatColor.s : customPrefrns.chatColor.r // message color bg
	const inverseColor = getContrastColor(color) // for color inversion
	if (isGroupMessage){
		
		if (message.type =="CHAT_JOIN_DISCONNECT"){
//--------------------------------------- display Join disconnect------------------------------------------------------------------------------------------------------------------------------------
			return (
				<div key={message.user} className="message__h type-timedate" >
					<div className="time__show">
						<span className="time__">
							{message.user} {message.joinDicntType =="join" ? "joined" : "left"} the Chat 
						</span>
					</div>
				</div>
			)
		} else if (message.type == "CHAT_FILE_EVENT"){
			const fileRef = useRef(null)
//--------------------------------------- display files------------------------------------------------------------------------------------------------------------------------------------
			return(
				<motion.div key={i} className={isSentMsg ? "message__h type-sent" : "message__h type-receive"}
					initial={{ opacity: 0, x: isSentMsg ? 28 : -28 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, }}
					style={{ borderRadius: `${customPrefrns.messageCrnr}px` }}
				>
					<div className={detailBox ? "message__wrapper group_wrapper hide" : "message__wrapper group_wrapper"} 
						style={{ background: color, borderRadius: `${customPrefrns.messageCrnr}px` }}
					>
						<div className="message__in">
							<div className="message__content" 
								style={{ color: inverseColor, fontSize: `${customPrefrns.fontSize}px` }}
							>
								{message.fileType.startsWith("image/") && <img src={message.c} alt="" /> }
								{message.fileType.startsWith("video/") && <video controls controlsList="nodownload">
									<source src={message.c} type={message.fileType} />
									Your browser does not support the video tag.
								</video>}
								{message.fileType.startsWith("audio/") && (<audio controls controlsList="nodownload">
									<source src={message.c} type={message.fileType} />
									Your browser does not support the audio tag.
								</audio>)}
								
								{!/^image\/|video\/|audio\//.test(message.fileType) && <File color={inverseColor} />}

								<br />
								{message.ct}
							</div>
							<span className="message__time" style={{ color: inverseColor }}>
								{getTime(message.t)}
							</span>
							{isSentMsg ? <span className='message__status'>
								<ReadReceipts status={message.sa} dColor={customPrefrns.tickColor.d} rColor={customPrefrns.tickColor.r} />
							</span> : ""}

						</div>
						<div className="message__options">
							
						</div>
						<div className="message__group__sender__avatar" onClick={() => setShowUser(true)}>
							<div className="m-g-s-avatar-inner">
								<img src={message.pic} alt="" />
							</div>
						</div>
						<div className="message__group__sender__name" >
							<p style={{ color: message.show_color }}>{message.user}</p>
						</div>
						<div className="message__group__file" ref={fileRef} onClick={()=>{
							if (fileRef.current) {
								const link = document.createElement('a');
								link.href = message.c;
								link.download = message.fileName;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}
						}}>
							<Download color={inverseColor} size={20}/>
							<span style={{ color: inverseColor, fontSize: `${customPrefrns.fontSize}px` }}
							>{" "+getFileSize(message.fileSize) + "  / " + message.fileType}</span>
						</div>
						<AnimatePresence>
							{showUser && <GetUser isMe={isSentMsg} group={true} id={message.userId} closeFunct={() => setShowUser(false)} />}
						</AnimatePresence>

					</div>
				</motion.div>
			)
		}
//--------------------------------------- display groups only text Messages------------------------------------------------------------------------------------------------------------------------------------

		return (
			<motion.div key={i} className={isSentMsg ? "message__h type-sent" : "message__h type-receive"}
				initial={{ opacity: 0, x: isSentMsg ? 28 : -28 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, }}
				style={{ borderRadius: `${customPrefrns.messageCrnr}px` }}
			>
				<div className={detailBox ? "message__wrapper group_wrapper hide" : "message__wrapper group_wrapper"}
					style={{ background: color, borderRadius: `${customPrefrns.messageCrnr}px` }}
				>
					<div className="message__in">
						<div className="message__content" style={{ color: inverseColor, fontSize: `${customPrefrns.fontSize}px` }}>
							{message.c}
						</div>
						<span className="message__time" style={{ color: inverseColor }}>
							{getTime(message.t)}
						</span>
						{isSentMsg ? <span className='message__status'>
							<ReadReceipts  status={message.sa} dColor={customPrefrns.tickColor.d} rColor={customPrefrns.tickColor.r} />
						</span> : ""}

					</div>
					<div className="message__options">
						<div onClick={() => setSmallBoxActive(!smallBoxActive)} onMouseLeave={() => setSmallBoxActive(false)} className="m__option" >
							<DashBoardICon type='dots' color={inverseColor} />
							<AnimatePresence>
								{smallBoxActive && <SmallBox m_id={message._id} message={message.c} time={message.t} togleDetailBox={setDetailBox} side={!isSentMsg} />}
							</AnimatePresence>
						</div>
					</div>
					<div className="message__group__sender__avatar" onClick={() => setShowUser(true)}>
						<div className="m-g-s-avatar-inner">
							<img src={message.pic} alt="" />
						</div>
					</div>
					<div className="message__group__sender__name" >
						<p style={{ color: message.show_color }}>{message.user}</p>
					</div>
					<AnimatePresence>
						{showUser && <GetUser isMe={isSentMsg} group={true} id={message.userId} closeFunct={() => setShowUser(false)}/>}
					</AnimatePresence>
					
				</div>
				<AnimatePresence>
					{detailBox && <GetMessageDetails togleDetailBox={setDetailBox} group={true} gMessage={message}/>}
				</AnimatePresence>
			</motion.div>
		)
	}
//--------------------------------------- display chats new messages ------------------------------------------------------------------------------------------------------------------------------------

	return (
		<motion.div key={i} className={!isSentMsg ? "message__h type-receive" : "message__h type-sent"}
			initial={{ opacity: 0, x: isSentMsg ? 28 : -28 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, delay: message.c_id ? i / 20 : 0 }}
			style={{ borderRadius: `${customPrefrns.messageCrnr}px` }}
		>
			<div className={detailBox ? "message__wrapper hide" : "message__wrapper"} 
				style={{ background: color, borderRadius: `${customPrefrns.messageCrnr}px` }}
			>
				<div className="message__in">
					<div className="message__content" style={{ color: inverseColor, fontSize: `${customPrefrns.fontSize}px` }}>
						{message.c}
					</div>
					<span className="message__time" style={{ color: inverseColor }}>
						{getTime(message.t)}
					</span>
					{isSentMsg ? <span className='message__status'>
						<ReadReceipts status={message.sa} dColor={customPrefrns.tickColor.d} rColor={customPrefrns.tickColor.r} />
					</span> : ""}

				</div>
				<div className="message__options">
					<div onClick={() => setSmallBoxActive(!smallBoxActive)} onMouseLeave={() => setSmallBoxActive(false)} className="m__option" >
						<DashBoardICon type='dots' color={inverseColor ? inverseColor : 'white'} />
						<AnimatePresence>
							{smallBoxActive && <SmallBox m_id={message._id} message={message.c} time={message.t} togleDetailBox={setDetailBox} side={!isSentMsg} />}
						</AnimatePresence>
					</div>
				</div>
			</div>
			<AnimatePresence>
				{detailBox && <GetMessageDetails togleDetailBox={setDetailBox} />}
			</AnimatePresence>
		</motion.div>
	)
})

