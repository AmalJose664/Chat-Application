import React, { useEffect, useRef, useState } from 'react'
import '../MessageSpace.css'
import { motion } from "framer-motion";
import DashBoardICon from '../../../../assets/DashBoardICon'
import {userDataStore} from  '../../../../store/userDataStore'
import {SingleMessage, SmallBox} from './SingleMessage';
import ReadReceipts from '../../../../assets/ReadReceipts';
import './SingleMessage.css'
import { ToastContainer,Flip } from 'react-toastify';
import MessageSendComp from './MessageSendComp';
import { useChatStore } from '../../../../store/useChatStore';
import { useSpecialStore } from '../../../../store/specialStore'; 
import { useAuthStore } from '../../../../store/useAuthStore';
import GetMessageDetails from './GetMessageDetails';
import { getTime } from '../../../../lib/timefilter';
import { filterMessageByDay, findYesterdayAndToady } from '../../../../lib/chatUtilities';
import Particles from '../HomeUtils/TestComp';
import { SingleNewMessages } from './SingleNewMessages';



function MessageSpace() {
	const selectedUser = userDataStore(state => state.selectedUser)
	return (
		<div className='home-message-component'>
			{selectedUser && selectedUser.sqlId ? <MessageSpaceMessages selectedUser={selectedUser} /> : 
			
			// <NoUser show={true}/>
			<div style={{ width: '100%', height: '650px', position: 'relative' }}>
					<motion.div style={{ width: '100%', height: '650px', position: 'relative' }} 
						initial={{ opacity: 0, y: 60, scale:.7 }} animate={{ opacity: 1, y: 0, scale:1 }} 
						transition={{ duration: 2.1, ease:'anticipate' }}
					>
						<Particles
							particleColors={['#ffffff', '#57cafb']}
							particleCount={300}
							particleSpread={9}
							speed={.07}
							particleBaseSize={70}
							moveParticlesOnHover={false}
							alphaParticles={false}
							disableRotation={false}
						/>
					</motion.div>
			</div>
			}
			<ToastContainer
				position="top-right"
				autoClose={800}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Flip}
			/>
		</div>
	)
}

function MessageSpaceMessages({ selectedUser }){


	const fetchAndStoreSelectedUser = useChatStore((state) => state.fetchAndStoreSelectedUser);
	const setMakeConnection = useChatStore((state) => state.setMakeConnection);
	const deleteSocket = useChatStore((state) => state.deleteSocket);
	const updateSelectedUserMessages = useChatStore((state) => state.updateSelectedUserMessages);
	const clearSelectedUserMessages = useChatStore(state => state.clearSelectedUserMessages)
	const loadSelectedUserMessages = useChatStore((state) => state.loadSelectedUserMessages);
	const selectedUserMessages = useChatStore((state) => state.selectedUserMessages);
	const messageLoading = useChatStore(state => state.messageLoading)

	const setScrollFnRef = useSpecialStore(state => state.setScrollFnRef)
	
	
	const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
	 	messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	 };
	

	useEffect(() => {
		
		const timer = setTimeout(() => {
			scrollToBottom()
			setScrollFnRef(scrollToBottom)
		}, 500)
		return () => {
			clearTimeout(timer)
		}
	}, [selectedUserMessages])

	useEffect(() => {
		fetchAndStoreSelectedUser();
		//setMakeConnection(true)
		//loadSelectedUserMessages()
		if (selectedUserMessages.length != 0 ){
			clearSelectedUserMessages();
		}
		
		return ()=>{
			deleteSocket()
		}
	}, [selectedUser]);

	
	const getMessages = ()=>{
		loadSelectedUserMessages()
	}
	
	const filteredMessages = filterMessageByDay(selectedUserMessages)
	
	console.log("Message space messages re render!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Online  list=>",);
	

	return (
		<div className='h-m' >
			
			
			<motion.div className="home-messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} >
				<div className='wrapper'>
					{messageLoading && <div className="messages-loading-message-space">
						< l-newtons-cradle
							size="78"
							speed="1.2"
							color="white"
						></l-newtons-cradle >
					</div>}

					{filteredMessages.length != 0 ? (
					filteredMessages.map((dayMessages , mIndex) => ( 
						<React.Fragment key={mIndex}>
							<div key={mIndex*91} className="message__h type-timedate" >
								<div className="time__show">
									<span className="time__">
										{findYesterdayAndToady(dayMessages.displayDate, dayMessages.date)}
										
									</span>
								</div>
							</div>
							{dayMessages.groupedMessages.map((message, i) => (
								<SingleMessage key={i} message={message} i={i} />
							))}
						</React.Fragment>

					)))  : <p style={{textAlign:'center'}}>Say Hi and Start a Chat !! </p>}
					<NewMessages />  
					<SelectedUserLdr/>
					<div className="message__h type-timedate" onClick={() => setMakeConnection(true)}>
						<div className="time__show">
							<span className="time__">
								--------Yesterday---------
							</span>
						</div>
					</div>

					<div className="message__h type-sent" onClick={deleteSocket}>
						<div className="message__wrapper">
							<div className="message__in">
								<div className="message__content">
									Hey How are u? okeY ? pleas ereply Help  me okey Just
								</div>
								<span className="message__time">
									12.30
								</span>
								<span className='message__status'>
									<ReadReceipts status={1} />
								</span>
							</div>
							<div className="message__options">
								<DashBoardICon type='dots' color='grey' />
							</div>
						</div>
					</div>

					<div className="message__h type-receive" onClick={() => {
						console.log("inserting data one more");

						updateSelectedUserMessages({
							s: '67af6d1b043ae74cc741f6b8',
							r: '67af6d44043ae74cc741f6b9',
							c: 'message that was inserted id' + Math.random().toString(36),
							t: new Date().toISOString(),
							c_id: "67af6d1b043ae74cc741f6b8__67af6d44043ae74cc741f6b9",
							d: false,
							sa: 2,
							_id: "67c60acb1f8591bb3a15bbcd"

						})
						console.log("Insert finished");

					}}>
						<div className="message__wrapper">
							<div className="message__in">
								<div className="message__content">
									Insert new Messages with this message
								</div>
								<span className="message__time">
									12.30
								</span>

							</div>
							<div className="message__options">
								<div className="m__option" >
									<DashBoardICon type='dots' color='grey' />
								</div>
							</div>
						</div>
					</div>

					<div className="scroll__to_" ref={messagesEndRef}>
					</div>
				</div>

			</motion.div>
			<MessageSendComp />
		</div>
	)
}

const  NewMessages = React.memo(() =>{
	const selectedUserNewMessages = useChatStore(state => state.selectedUserNewMessages)
	
	if (!selectedUserNewMessages.length) return null;

	return (
		selectedUserNewMessages.map((message, i )=> (
			<SingleNewMessages message={message} key={i} i={i} />
		))  	
	)
})


function SelectedUserLdr(){
	const selectedChatTyping = useSpecialStore(state => state.selectedChatTyping)
	return (
		<>{selectedChatTyping &&
			<motion.div className='message__h type-receive' 
				style={{ padding: '3px 20px',
				background: 'transparent', 
				border: '1px solid royalblue', 
				marginLeft: '10px' }}
				initial={{ opacity: 0, x: -30, y: 0 }} animate={{ opacity: 1, x: 0, y: 0 }}
				transition={{ duration: 0.1, ease: 'easeInOut', }}
			 >
				 <l-leapfrog
					size="30"
					speed="2"
					color="white"
				></l-leapfrog>
			</motion.div>}
		</>
	)
}


export default MessageSpace
