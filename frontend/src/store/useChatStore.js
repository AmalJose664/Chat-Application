import { create } from "zustand";
import { axiosMessageInstance, ip, wsProto } from "../lib/axios";
import { userDataStore } from "./userDataStore";
import { toast } from 'sonner';
import { useAuthStore } from "./useAuthStore";
import { useSpecialStore } from "./specialStore";



function updateMessages(set, get, data){
	let me = useAuthStore.getState().authUser.db_user
	
	const message = data.message

	
	const newMessage = {
		r: data.receiver,
		s: data.sender,
		c: message ,
		t: data.created_at,
		c_id: false,
		d: false,
		sa: data.status,
		_id: Math.random().toString(36).slice(2,12)

	}
	const updateSelectedUserMessages = get().updateSelectedUserMessages
	const bringConvsToTop = userDataStore.getState().bringConvsToTop
	const updateLastMessage = userDataStore.getState().updateLastMessage
	
	updateSelectedUserMessages(newMessage)
	if(me._id == data.sender){
		bringConvsToTop(data.receiver)
		updateLastMessage(data.cnvstn_id, data.message + "__" +data.sender, data.status)
	}else{
		bringConvsToTop(data.sender)
		updateLastMessage(data.cnvstn_id, data.message +"__"+ data.sender, data.status)
	}
	
	
}
function chatUserTypeEvent(set, get, data){
	const selectedChatUser = get().selectedChatUser
	const selectedChatTyping = useSpecialStore.getState().typingChangeSelectedUser
	const convUserTyping = useSpecialStore.getState().typingChangeConv
	
	if (selectedChatUser && selectedChatUser.sqlId == data.sender){
		selectedChatTyping(data.type_status == "TYPE_START")
	}
	
	convUserTyping(data.type_status == "TYPE_START", data.sender)
	
	
}



function onlineUpdate(set, get, data){
	const setUsersOnline = useSpecialStore.getState().setUsersOnline
	const usersOnline = useSpecialStore.getState().usersOnline
	if(Object.keys(usersOnline).length == 0 && data.users.length==0){
		return
	}
	setUsersOnline(data.users)
	
}

function chatRoomChange(set,get,data){
	const setSelectUser = userDataStore.getState().setSelectUser
	const tempSelectedUser = userDataStore.getState().tempSelectedUser
	const setTempSelectedUser = userDataStore.getState().setTempSelectedUser
	const checkSelectecUserOnline = useSpecialStore.getState().checkSelectecUserOnline
	
	if(data.code == 200){
		set({ changingRoom: false })
		setSelectUser(tempSelectedUser)
		checkSelectecUserOnline(tempSelectedUser.sqlId)
		setTempSelectedUser(null)
	}else{
		setTempSelectedUser(null)
	}
}


function chatNotifications(set, get, data){

	toast.success(`Message from ${data.name} '${data.message}'`, { duration: 2000 })
	const bringConvsToTop = userDataStore.getState().bringConvsToTop
	const incrmtUnread = userDataStore.getState().incrmtUnreadAndLstm
	bringConvsToTop(data.sender)
	incrmtUnread(data.sender, data.message)
	

	
}
function serverError(set, get, data){
	console.log("errors here");
	toast.error("Message, server error")
	
}
function chatDeleteEvent(set,get,data){
	
	if (data.success == "success"){
		const message = data.m_c
		const message_id = data.m_id
		const message_time = data.m_time
		const deleteUser = data.user
		const deleteMessagesFromArray = get().deleteMessagesFromArray
		deleteMessagesFromArray(message_time, message_id)
		const user = useAuthStore.getState().authUser
		if(user.db_user._id == deleteUser){
			toast.info("Message Deleted , "+message,{duration:1500})
		} 
	}
	
}

//------------------------------------------store object ------------------------------------------------------------------------------------//

export const useChatStore = create((set, get) => ({
	chatMessage: '',

	chatSocket:null,
	getSocketDetails:()=>{
		const existingSocket = get().chatSocket
		if(existingSocket){
			return existingSocket.readyState
		}
		return 3
	},

	selectedChatUser: null,

	fetchAndStoreSelectedUser: () => {
		//from user Data store here it is stored
		const selectedUser = userDataStore.getState().selectedUser;
		
		const currentSelectedUser = get().selectedChatUser;

		if (!currentSelectedUser || currentSelectedUser.id !== selectedUser.id) {
			
			set({ selectedChatUser: selectedUser, selectedUserNewMessages: [] });
			const typingChangeConv = useSpecialStore.getState().typingChangeConv

			typingChangeConv(false, selectedUser.id)
		
		} 		
	},

	clearSelectedChatUser:()=>{
		const currentSelectedUser = get().selectedChatUser;
		if(currentSelectedUser) {set({ selectedChatUser: null });
	}
	},

	messageLoading:false,
	selectedUserMessages:[],
	selectedUserNewMessages:[],
	lastMessageCursor:'',

	loadSelectedUserMessages: async(prev=false)=>{
		try {
			let cursor = get().lastMessageCursor
			if(!cursor) cursor='0000000'
			set({messageLoading:true})
			const response = await axiosMessageInstance.get(`chat/${get().selectedChatUser.sqlId}/?limit=42&cursor=${cursor}`)
			if(cursor && prev){
				return set(state => ({ 
					selectedUserMessages: [...response.data.messages, ...state.selectedUserMessages], 
					selectedUserNewMessages: [], 
					lastMessageCursor: response.data.next_cursor 
				}))
			}
			set({ selectedUserMessages: response.data.messages, selectedUserNewMessages: [], lastMessageCursor: response.data.next_cursor })
			
		} catch (err) {
			console.log(err, err.message);
			toast.error("Error Loading Messages " + err.message)
		} finally {
			set({ messageLoading: false })
			
		}
	},
	clearSelectedUserMessages:()=>{
		set({ selectedUserMessages: [], selectedUserNewMessages: [], lastMessageCursor :''})
	},
	updateSelectedUserMessages: (newMessage) => {
		if(!newMessage){return}
		set((state) => ({ selectedUserNewMessages: state.selectedUserNewMessages.concat(newMessage) }));
		const scrollFnRef = useSpecialStore.getState().scrollFnRef
		if (scrollFnRef) scrollFnRef()
	},
	setChatMessage: (message) => {
		set({ chatMessage: message })
	},

	handleSocketMessages:(parsedData)=>{
		
		const handlers = {
			'CHAT_MESSAGE_EVENT': updateMessages,
			'CHAT_NOTIFICATION_EVENT': chatNotifications,
			'CHAT_ONLINE_USERS_EVENT': onlineUpdate,
			'CHAT_SERVER_ERROR_EVENT': serverError,
			'CHAT_TYPE_EVENT': chatUserTypeEvent,
			'CHAT_DELETE_EVENT':chatDeleteEvent,
			'CHAT_ROOM_CHANGE': chatRoomChange,
		}
		if (handlers[parsedData.type]){
			const callFunction = handlers[parsedData.type]
			callFunction(set, get, parsedData)
		}else{
			console.log("Incorrect Message Type Reecived");
		}
		
	},
	changingRoom : false,
	setMakeConnection: (roomForUser)=>{
		const existingSocket = get().chatSocket
		if (existingSocket){
			console.log("socket exists returning, Cant create new socket");
			return
		}
		
		
		const accessToken = localStorage.getItem('access_token')
		if(!accessToken) return toast.error("No access token found , Please Logout and loggin");
		
		let room
		room = roomForUser ? get().selectedChatUser.sqlId : "CONNECTION_FOR_ONLINE_STATUS"

		let newSocket = null
		const url = `${wsProto}://${ip}/ts/${room}/?token=${accessToken}`

		newSocket = new WebSocket(url)
		newSocket.onmessage = (event)=>{
			try{
				const parsedData = JSON.parse(event.data)
				
				get().handleSocketMessages(parsedData)
			}catch(err){
				console.log(err,err.message);
				toast.error("Incorrect format message received !!")
				
			}
			
			
		}
		newSocket.onopen = (event) => {
			console.log("Sockect opened and connected");
			
			const checkSelectecUserOnline = useSpecialStore.getState().checkSelectecUserOnline
			if(roomForUser){
				checkSelectecUserOnline(roomForUser)
			}
			

		}
		newSocket.onclose = (event) => {
			console.log("Sockect closed and disconnected.=> Manual close");
			
			const existingSocket = get().chatSocket
			const socketExit = useSpecialStore.getState().socketExit
			socketExit()
			if (existingSocket) {
				set({ chatSocket: null})
			}

		}
		newSocket.onerror = (event) => {
			console.log("Sockect error and disconnected.=> Error close");
			toast.error("Connection error, closed Automatically")
			const existingSocket = get().chatSocket
			const socketExit = useSpecialStore.getState().socketExit
			socketExit()
			if (existingSocket) {
				set({ chatSocket: null})
			}

		}
		if (newSocket){
			set({ chatSocket: newSocket })
		}
		
	},
	deleteSocket:()=>{
		const socket = get().chatSocket
		if(socket){
			console.log("Socket deleted");
			
			socket.close()
		}
		
		set({ chatSocket: null })
	},

	sendMessage:()=>{
		
		const socket = get().chatSocket
		const selectedConvId = useSpecialStore.getState().selectedConvId
		
		if (!socket || socket.OPEN != socket.readyState) {
			return toast.error("Error on sending message. Not connected !!")
		}
		const message = get().chatMessage
		if (!message) return
		const user = useAuthStore.getState().authUser.db_user
		try{
			socket.send(JSON.stringify({
				'type': 'CHAT_MESSAGE_EVENT',
				'message': message,
				'name': user.user_name,
				'conv_id': selectedConvId
			}));
		}catch(err){
			console.log(err,err.message,"<===");
			return toast.error("Error on sending message !! "+err.message)
		}
	},
	changeRoomOrUser:(newRoom) =>{
		const user = useAuthStore.getState().authUser.db_user
		const socket = get().chatSocket


		if (!socket || socket.OPEN != socket.readyState) {
			return console.log("No socket , returned");
		}

		try {
			set({ changingRoom:true })
			socket.send(JSON.stringify({
				'type': 'CHAT_ROOM_CHANGE',
				'name': user,
				'new_chat': newRoom,
			}))
		} catch (err) {
			console.log(err, err.message);
			toast.error("Error on user change !! "+err.message)
			set({ changingRoom: false })
		}
	},

	sendTypeStatus:(status)=>{
		const user = useAuthStore.getState().authUser.db_user
		const socket = get().chatSocket

		
		if (!socket || socket.OPEN != socket.readyState) {
			return console.log("No socket , returned");
		}
		
		try{
			socket.send(JSON.stringify({
				'type': 'CHAT_TYPE_EVENT',
				'type_status': status,
				'name': user.user_name,
			}))
		}catch(err){
			console.log(err, err.message);
		}
		

	}, deleteMessageStore: ( messageTime, mId) => {
		const user = useAuthStore.getState().authUser.db_user
		const socket = get().chatSocket
		if (!socket || socket.OPEN != socket.readyState) {
			return console.log("No socket , returned");
		}
		
		try {
			socket.send(JSON.stringify({
				'type': 'CHAT_DELETE_EVENT',
				'name': user.user_name,
				'm_time': messageTime,
				'm_id': mId
			}))
		} catch (err) {
			console.log(err, err.message);
			toast.error("Message deletion unsuccesful ! "+err.message)
		}
	},
	deleteMessagesFromArray:(mtime , mId, )=>{
		
		set( state=>{
			if(mId != ""){
				return { selectedUserMessages: state.selectedUserMessages .filter(item => item._id != mId || item.t != mtime)}
			}else{
				return { selectedUserNewMessages: state.selectedUserNewMessages.filter(item =>  item.t != mtime) }
			}
		})
	},
	setReadMessages:(status)=>{
		if(status==0 || status>=3) return
		
		set(state=>{
			const updatedArray = [...state.selectedUserNewMessages];
			let i = updatedArray.length-1
			for(i; i >= 0; i--){
				
				if (updatedArray[i].sa != status) {
					updatedArray[i] = { ...updatedArray[i], sa: status }
				}else{
					break
				}
			}
			
			return { selectedUserNewMessages: updatedArray }
		})
	}


}))