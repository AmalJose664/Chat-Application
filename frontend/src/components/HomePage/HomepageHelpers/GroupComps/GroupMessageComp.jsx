import React, { useRef } from 'react'
import DashBoardICon from '../../../../assets/DashBoardICon';
import MessageSendComp from '../MessageComponents/MessageSendComp';
import {motion} from 'framer-motion'
import ReadReceipts from '../../../../assets/ReadReceipts';
import { useGroupStore } from '../../../../store/useGroupStore';
import { SingleNewMessages } from '../MessageComponents/SingleNewMessages';

function GroupMessageComp() {
	const messagesEndRef = useRef(null);
	const setGroupMessages = useGroupStore(state => state.setGroupMessages)
  return (
	  <div className='h-m' >


		  <motion.div className="home-messages" exit={{ opacity: 0, y: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} >
			  <div className='wrapper'>

				  <NewMessages />
				  <div className="message__h type-sent">
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
					  setGroupMessages({
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

const NewMessages = React.memo(() => {
	const groupMessages = useGroupStore(state => state.groupMessages)

 	return (
		<>
			{groupMessages.length != 0 ? groupMessages.map((message, i) => (
				<SingleNewMessages message={message} key={i} i={i} />
			)) : 
				<p style={{ textAlign: 'center' }}>Say Hi and Start a Chat !! </p>
			}
		</>
		
	)
})

export default GroupMessageComp
