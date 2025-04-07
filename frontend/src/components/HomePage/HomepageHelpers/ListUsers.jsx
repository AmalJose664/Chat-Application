import React, { useEffect, useState } from 'react'
import './ListUsers.css'
import { userDataStore } from '../../../store/userDataStore.js'
import { motion } from "framer-motion";
import { axiosMessageInstance } from '../../../lib/axios.js';
import { newtonsCradle } from 'ldrs';
import ListFriends from './ListFriends.jsx';
import { filterLastMessage, lastMessage } from '../../../lib/lastMessageFilter.js';
import { useSpecialStore } from '../../../store/specialStore.js';
import ReadReceipts from '../../../assets/ReadReceipts.jsx';
import { useAuthStore } from '../../../store/useAuthStore.js';
import { getTime } from '../../../lib/timefilter.js';
import { useChatStore } from '../../../store/useChatStore.js';


newtonsCradle.register()

function ListUsers() {
	
	const convListTyping = useSpecialStore(state => state.convListTyping)
	const conversations = userDataStore(state => state.conversations)
	const setConversationsStore = userDataStore(state => state.setConversationsStore)
	const selectedUserId = userDataStore(state => state.selectedUser?.sqlId)
	const deleteSocket = useChatStore((state) => state.deleteSocket);

	const usersOnline = useSpecialStore(state => state.usersOnline)
	const [convLoader,setConvLoader] = useState(false)

	const getConversations = async()=>{
		setConvLoader(true)
		try{
			const response = await axiosMessageInstance.get('conversations/?limit=30&cursor=0000000')
			console.log(response.data);
			setConversationsStore(response.data.conversations, response.data.unseen_noti)
			
		}catch(err){
			console.log(err, err.message);
			
		}finally{
			setConvLoader(false)
		}

	}
	useEffect(() => {
		console.log("change in seleected user ");

	}, [selectedUserId])  
	
	
	useEffect(()=>{
		if(conversations.length==0){
			getConversations()
		}
		return ()=>{
			deleteSocket()
		}
	},[])

	console.log("render in List ussers");
	
  return (
	<div className='home-users-container'>
		<div className="home-users">
			  {convLoader && <motion.div className='list-friends-loader' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
				  < l-newtons-cradle
					  size="78"
					  speed="1.2"
					  color="white"
				  ></l-newtons-cradle >
			  </motion.div>}
			{( conversations.length != 0 ) ? (conversations.map((value, i) => {
				return (
					<div key={i} className={value.other_user.sqlite_id == selectedUserId ? "home-list-users-each selected" : "home-list-users-each"}>
						<EachConversations value={value} i={i} key={i} type={!!convListTyping[value.other_user.sqlite_id]}
							isOnline={!!usersOnline[value.other_user.sqlite_id]} />
					</div>
				)
				
			})) : !convLoader && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}
				className=''>Start a new Chat</motion.p> } 
			
		</div>
		<ListFriends/>
		
	</div>
	
  )
}

const EachConversations = React.memo(({ value, i: index, type, isOnline,  })=>{

	
	const authUser = useAuthStore(state => state.authUser)
	const clearUnread = userDataStore(state => state.clearUnread)
	
	const setSelectUser = userDataStore(state => state.setSelectUser)
	const getSocketDetails = useChatStore(state => state.getSocketDetails)
	const changeRoomOrUser = useChatStore(state => state.changeRoomOrUser)
	const setTempSelectedUser = userDataStore(state => state.setTempSelectedUser)
	

	const setUserPictData = useSpecialStore(state => state.setUserPictData)

	
	const changeUser = (value, i, unread) => {
		const readyState = getSocketDetails()
		if (readyState == 0){
			return
		}
		else if (readyState != 1) {
			setSelectUser({
				user_name: value.other_user.user_name,
				id: value.other_user._id,
				sqlId: value.other_user.sqlite_id,
				user_id: value.other_user._id,
				pic: value.other_user.profile_picture,
				conv_v: i,
				conv_id: value._id
			})
		}
		else{
			setTempSelectedUser({
				user_name: value.other_user.user_name,
				id: value.other_user._id,
				sqlId: value.other_user.sqlite_id,
				user_id: value.other_user._id,
				pic: value.other_user.profile_picture,
				conv_v: i,
				conv_id: value._id
			})
			changeRoomOrUser(value.other_user.sqlite_id)
		}
		
		
		if (unread > 0) {
			clearUnread(i)
		}
	}
	const showMyPic = (obj)=>{	
		setUserPictData(obj)
	}

	console.log("render from each user change in ", value.other_user.user_name);

	return (

		<motion.div key={index} className={value.unread_count != 0 ? "home-user unread" : "home-user"}
			initial={{ opacity: 0, x: -60, }} animate={{ opacity: 1, x: 0, }}
			transition={{ duration: 0.5, delay: index / 10, ease: 'easeInOut', }}>

			<div className='home-user-cont' >
				<div className={isOnline ? "home-user-pic is-online" : "home-user-pic"} 
					onClick={() => showMyPic(value.other_user )}>
					<img src={value.other_user.profile_picture} alt="" />
				</div>
				<div className="home-user-detail"
					onClick={() => changeUser(value, index, value.unread_count)}>
					<div className="user-top">
						<div className="user-title">
							{value.other_user.user_name}
						</div>
						{value.unread_count != 0 && <div className="user-unread">
							{value.unread_count}
						</div>}
					</div>
					<div className="user-bottom">
						<div className="user-last-m">
							{/* {filterLastMessage(value.lst_m, authUser.db_user._id) ? 'last message by me' : "lastmessage by other user"} */}
							{type 	? 
							<motion.div className="list-covns-user-istyping" initial={{ opacity: 0, y: 20, }} animate={{ opacity: 1, y: 0, }}
								transition={{ duration: 0.2}}>
								<l-leapfrog
									size="20"
									speed="2"
									color="#78c5f4"
								></l-leapfrog>
							</motion.div> 
							: 
							<motion.span initial={{ opacity: 0, y: 20, }} animate={{ opacity: 1, y: 0, }}
								transition={{ duration: 0.2 }} >{lastMessage(value.lst_m)}</motion.span>
							}
						</div>
						<div className="user-last-status">
							<div className="show-time-user-list-conv-list">
								{getTime(value.t,false)}
							</div>
							{filterLastMessage(value.lst_m, authUser.db_user._id) ? <><ReadReceipts status={value.l_s} />
								<p>{value.l_s}</p></> : ""}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	
	)
})

export default React.memo(ListUsers)
