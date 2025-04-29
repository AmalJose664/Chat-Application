import React from 'react'
import { motion } from 'framer-motion'
import { userDataStore } from '../../../../store/userDataStore'
import { useChatStore } from '../../../../store/useChatStore'
import { getTime, statusFilter, typeFilter } from '../../../../lib/timefilter'

function GetMessageDetails({ togleDetailBox, group=false, gMessage }) {
	const showMessageId = userDataStore(state => state.showMessageId)
	const selectedUserMessages = useChatStore(state => state.selectedUserMessages)
	const selectedUserNewMessages = useChatStore(state => state.selectedUserNewMessages)
	

	
	let [message] = selectedUserMessages.filter(m => m._id === showMessageId)
	
	
	if(!message){
		[message] = selectedUserNewMessages.filter(m => m._id === showMessageId)
	}
	return (
		<motion.div className="get-message-details-container" 
			dragConstraints={{ left: -400, right: 400, top: -50, bottom: 500 }}
			drag initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }} exit={{ opacity: 0, scale: .6 }}> 
			<span className='g-m-d-c-close-btn'
				onClick={() => togleDetailBox(false)}
			>&times;</span>
			{message && <div className="g-m-d-c-inner">
				<h3>Message Details</h3>

				<div className="g-m-d-c-i-content" >
					<table>
						<tbody>
							<tr>
								<td>Message Id :</td>
								<td>{"''"}</td>
							</tr>
							<tr>
								<td>Content :</td>
								<td>{message.c}</td>
							</tr>
							<tr>
								<td>Exact Time :</td>
								<td>{getTime(message.t,true)}</td>
							</tr>
							<tr>
								<td>Conversation Id : </td>
								<td> {" '' "}</td>
							</tr>
							<tr>
								<td>Status :</td>
								<td>{statusFilter(message.sa)}</td>
							</tr>
							<tr>
								<td>Type :</td>
								<td>{typeFilter(message.ty)}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>}
			{group && <div className="g-m-d-c-inner">
				<h3>Message Details</h3>

				<div className="g-m-d-c-i-content" >
					<table>
						<tbody>
							<tr>
								<td>Message Id :</td>
								<td>{gMessage._id}</td>
							</tr>
							<tr>
								<td>Content :</td>
								<td>{gMessage.c}</td>
							</tr>
							<tr>
								<td>Exact Time :</td>
								<td>{getTime(gMessage.t, true)}</td>
							</tr>
							<tr>
								<td>Sent By</td>
								<td> {gMessage.user} ({gMessage.initials}) <img className='getmessage-details-avatar' src={gMessage.pic} alt="" /></td>
							</tr>
							<tr>
								<td>Status :</td>
								<td>Delivered</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>}
			{(!message && !gMessage) && <div><p>No data found</p></div> } 
		</motion.div>
	)
}

export default GetMessageDetails
