import React, { useEffect, useRef} from 'react'
import '../MessageSpace.css'
import { motion } from "framer-motion";
import {userDataStore} from  '../../../../store/userDataStore'
import {SingleMessage } from './SingleMessage';
import './SingleMessage.css'
import MessageSendComp from './MessageSendComp';
import { useChatStore } from '../../../../store/useChatStore';
import { useSpecialStore } from '../../../../store/specialStore'; 
import { filterMessageByDay, findYesterdayAndToady, loadPreferences, convertStringToCss } from '../../../../lib/chatUtilities';
import Particles from '../HomeUtils/TestComp';
import { SingleNewMessages } from './SingleNewMessages';



function MessageSpace() {
	const selectedUser = userDataStore(state => state.selectedUser)
	const setMakeConnection = useChatStore((state) => state.setMakeConnection);
	const getSocketDetails = useChatStore(state => state.getSocketDetails)
	const deleteSocket = useChatStore((state) => state.deleteSocket);
	const socketType = useChatStore((state) => state.socketType);


	useEffect(()=>{
		let socketTimeout
		let socktdtails = getSocketDetails()
		 if (socktdtails == 3 ) {
		
			socketTimeout = setTimeout(() => {
				//setMakeConnection(false)
			}, 1000);
		 }
		 return ()=>{
			clearTimeout(socketTimeout)
		 }
	},[selectedUser])
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
			
		</div>
	)
}

function MessageSpaceMessages({ selectedUser }){


	const fetchAndStoreSelectedUser = useChatStore((state) => state.fetchAndStoreSelectedUser);
	const setMakeConnection = useChatStore((state) => state.setMakeConnection);
	const clearSelectedUserMessages = useChatStore(state => state.clearSelectedUserMessages)
	const loadSelectedUserMessages = useChatStore((state) => state.loadSelectedUserMessages);
	

	const selectedUserMessages = useChatStore((state) => state.selectedUserMessages);
	const messageLoading = useChatStore(state => state.messageLoading)

	const setScrollFnRef = useSpecialStore(state => state.setScrollFnRef)
	const chatSocket = useChatStore(state => state.chatSocket);
	
	
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
		
		//loadSelectedUserMessages()
		if (selectedUserMessages.length != 0 ){
			clearSelectedUserMessages();
		}
		
		
	}, [selectedUser]);

	
	
	const filteredMessages = filterMessageByDay(selectedUserMessages)
	
	
	const customPrefrns = loadPreferences()
	return (
		<div className='h-m' style={{ ...convertStringToCss(customPrefrns.customBackground) }}>
			
			
			<motion.div className="home-messages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} >
				<div className='wrapper'>
					{messageLoading && <div className="messages-loading-message-space">
						< l-newtons-cradle
							size="78"
							speed="1.2"
							color="white"
						></l-newtons-cradle >
					</div>}
					{selectedUserMessages?.length!=0 && 
						<div className="message__h type-timedate" onClick={() => loadSelectedUserMessages()}
							style={{ backgroundColor: '#6b9efc', marginTop: '25%', marginBottom: '10%', cursor: 'pointer', padding: '15px' }}
						>
							<div className="time__show">
								<span className="time__">
									Load More
								</span>
							</div>
						</div>
					}
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
								<SingleMessage customPrefrns={customPrefrns} key={i} message={message} i={i} />
							))}
						</React.Fragment>

					)))  : <p style={{textAlign:'center'}}>Say Hi and Start a Chat !! </p>}
					<NewMessages customPrefrns={customPrefrns}/>  
					<SelectedUserLdr messageCrnr={customPrefrns.messageCrnr}/>

					{selectedUserMessages.length == 0  && 
						<div className="message__h type-timedate" onClick={() => loadSelectedUserMessages()}
						style={{ backgroundColor: 'gray', marginTop: '25%', cursor: 'pointer', padding: '15px' }}
						>
						<div className="time__show">
							<span className="time__">
								Load Old Messages
							</span>
						</div>
					</div>}


					{!chatSocket && <div className="message__h type-timedate" onClick={() => setMakeConnection(true)}
						style={{backgroundColor:'royalblue', marginTop:'1%', cursor:'pointer', padding:'20px'}}
						>
						<div className="time__show">
							<span className="time__">
								Start Messaging
							</span>
						</div>
					</div>}
					
					<div className="scroll__to_" ref={messagesEndRef}>
					</div>
				</div>

			</motion.div>
			<MessageSendComp enterSend={customPrefrns.enterSend} mesgTrans={customPrefrns.mesgTrans} />
		</div>
	)
}

const  NewMessages = React.memo(({customPrefrns}) =>{
	const selectedUserNewMessages = useChatStore(state => state.selectedUserNewMessages)
	
	if (!selectedUserNewMessages.length) return null;

	return (
		selectedUserNewMessages.map((message, i )=> (
			<SingleNewMessages customPrefrns={customPrefrns} message={message} key={i} i={i} />
		))  	
	)
})


function SelectedUserLdr({ messageCrnr=10 }){
	const selectedChatTyping = useSpecialStore(state => state.selectedChatTyping)
	return (
		<>{selectedChatTyping &&
			<motion.div className='message__h type-receive'
				style={{ padding: '3px 20px',
				background: 'transparent', 
				border: '1px solid royalblue', 
				borderRadius: `${messageCrnr}px`,
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
