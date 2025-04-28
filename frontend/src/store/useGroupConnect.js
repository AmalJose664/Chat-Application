import { create } from "zustand";
import { ip, wsProto } from "../lib/axios";
import { useGroupStore } from "./useGroupStore";
import { useAuthStore } from "./useAuthStore";
import { toast } from 'sonner';



function updateMessages(set, get, data) {

	const message = data.message
	const setGroupMessages = useGroupStore.getState().setGroupMessages

	const newMessage = {
		type:data.type,
		s: data.sender,
		c: message,
		t: data.created_at,
		user: data.name.split("__")[0],
		userId:data.name.split("__")[1],
		pic: data.pro_pic,
		initials: data.initials,
		sa: data.status,
		_id: Math.random().toString(36).slice(2, 12),
		show_color: data.show_color,

	}
	setGroupMessages(newMessage)

}
function groupJoinDisconnect(set, get, data) {
	const user = useAuthStore.getState().authUser.db_user
	const setGroupMessages = useGroupStore.getState().setGroupMessages
	if(user.user_name == data.user) return
	const newJoin = {
		type:data.type,
		user :data.user,
		joinDicntType: data.fucnt
	}
	setGroupMessages(newJoin)
}

function onlineUpdate(set, get, data) {
	const setOnlineUsers = useGroupStore.getState().setOnlineUsers
	setOnlineUsers(data.users, data.len)
}


async function handleFileSend(set, get, data) {

	const buffer = new Uint8Array(data);

	const delimiter = "||META_END||";
	const textDecoder = new TextDecoder();

	let metadataText = "";
	let delimiterFound = false;
	let delimiterIndex = 0;

	for (let i = 0; i < buffer.length; i++) {
		metadataText += String.fromCharCode(buffer[i]);

		if (metadataText.endsWith(delimiter)) {
			delimiterFound = true;
			delimiterIndex = i + 1 - delimiter.length;
			break;
		}

		if (i > 10000) {
			console.error("Delimiter not found in reasonable range");
			toast.error("A file was sent , Error occured while decoding file ")
			return;
		}
	}

	if (!delimiterFound) {
		console.error("Could not find metadata delimiter in the received message");
		return;
	}
	const metadataString = textDecoder.decode(buffer.slice(0, delimiterIndex));
	const metadata = JSON.parse(metadataString);

	const fileData = buffer.slice(delimiterIndex + delimiter.length);
	const fileBlob = new Blob([fileData],{type:metadata.fileType})

	const fileUrl = URL.createObjectURL(fileBlob);

	const setGroupMessages = useGroupStore.getState().setGroupMessages

	
	const newMessage = {
		
		type: metadata.type,
		s: metadata.sender,
		c: fileUrl,
		t: metadata.created_at,
		user: metadata.name.split("__")[0],
		userId: metadata.name.split("__")[1],
		pic: metadata.pro_pic,
		initials: metadata.initials,
		sa: metadata.status,
		_id: Math.random().toString(36).slice(2, 12),
		show_color: metadata.show_color,
		fileName: metadata.fileName,
		fileType: metadata.fileType,
		fileSize: metadata.fileSize,
		ct:metadata.text
	}
	setGroupMessages(newMessage)

}
function kickMessage(set, get, data){
	toast.info("You was Kick from the Group by Group Creator")
}


//handler functions-------------------------------------
//zustand---------------------

export const useGroupConnectStore = create((set, get) => ({

	groupSocket:null,

	groupChatMessage: "",

	setGroupChatMessage:(message)=>{
		set({ groupChatMessage: message })
	},

	handleSocketMessages: (parsedData) => {

		const handlers = {
			'CHAT_MESSAGE_EVENT': updateMessages,
			'CHAT_JOIN_DISCONNECT': groupJoinDisconnect,
			'CHAT_ONLINE_USERS_EVENT': onlineUpdate,
			'CHAT_REMOVE_EVENT': kickMessage
		}
		if (handlers[parsedData.type]) {
			const callFunction = handlers[parsedData.type]
			callFunction(set, get, parsedData)
		} else {
			console.log("Incorrect Message Type Reecived");
		}

	},

	setGroupSocket:(groupKey, joinKey)=>{
		if(!groupKey || !joinKey) return
		
		const existingSocket = get().groupSocket
		const setConnected = useGroupStore.getState().setConnected
		const clearGroupMessages = useGroupStore.getState().clearGroupMessages


		if (existingSocket) {
			console.log("socket exists returning");
			return
		}
		

		const accessToken = localStorage.getItem('access_token')
		if (!accessToken) return toast.error("No access token found , Please Logout and loggin");



		let newSocket = null
		const url = `${wsProto}://${ip}/group-chat/${groupKey}/${joinKey}/?token=${accessToken}`


		newSocket = new WebSocket(url)
		newSocket.binaryType = "arraybuffer";
		newSocket.onmessage = (event) => {
			try {
				if (event.data instanceof ArrayBuffer) {
					return handleFileSend(set, get, event.data)
				}
				const parsedData = JSON.parse(event.data)

				get().handleSocketMessages(parsedData)
			} catch (err) {
				console.log(err, err.message);
			}
		}
		newSocket.onopen = (event) => {
			
			console.log("Sockect opened and connected");
			setConnected(true)
		}
		newSocket.onclose = (event) => {
			console.log("Sockect closed and disconnected. Maunual close, Group connection socket",event.code, event.reason)
			
			set({ groupSocket: null })
			setConnected(false)
			clearGroupMessages()
		}
		newSocket.onerror = (event) => {
			console.log("Sockect error and disconnected. Error close, Group connection socket ");
			console.log("Error:",event);
			
			
			set({ groupSocket: null })
			clearGroupMessages()
			setConnected(false)
		}
		if (newSocket) {
			set({ groupSocket: newSocket })
		}
	},
	deleteSocket:()=>{
		const socket = get().groupSocket
		if (socket) {
			socket.close()
		}
		set({ groupSocket: null })
	},

	sendGroupMessage:()=>{
		const socket = get().groupSocket

		if (!socket || socket.OPEN != socket.readyState) {
			return toast.error("Error on sending message. Not connected !!")
		}
		const message = get().groupChatMessage
		if(!message) return
		const user = useAuthStore.getState().authUser.db_user
		try {
			
			socket.send(JSON.stringify({
				'type': 'CHAT_MESSAGE_EVENT',
				'message': message,
				'name': user.user_name,
			}));
			set({ groupChatMessage: "" })
			
		} catch (err) {
			console.log(err, err.message);
			return toast.error("Error on sending message, " + err.message)
		}
	},
	sendFileText: (file,text) => {
		
		const socket = get().groupSocket

		if (!socket || socket.OPEN != socket.readyState) {
			return toast.error("Error on sending file. Not connected !!")
		}
		const user = useAuthStore.getState().authUser.db_user
		try {
			

			const metadata = JSON.stringify({
				type: "CHAT_FILE_EVENT",
				user: user.user_name,
				text,
				fileName: file.name,
				fileType: file.type,
				fileSize: file.size,
			});
			

			const delimiter = "||META_END||";
			const combinedMetadata = metadata + delimiter;

			const metadataBuffer = new TextEncoder().encode(combinedMetadata)

			const reader = new FileReader()
			reader.onloadend = (event)=>{
				const fileBuffer = event.target.result

				const blob = new Blob([metadataBuffer, fileBuffer])

				socket.send(blob)
				set({ groupChatMessage: "" })
			} 
			reader.readAsArrayBuffer(file);

		} catch (err) {
			console.log(err, err.message);
			return toast.error("Error on sending file, " + err.message,)
		}
	},
	removeUser: (remoUser='')=>{
		const socket = get().groupSocket

		if (!socket || socket.OPEN != socket.readyState || !remoUser) {
			return toast.error("Error on sending message")
		}
		const user = useAuthStore.getState().authUser.db_user
		try {

			socket.send(JSON.stringify({
				'type': 'CHAT_REMOVE_EVENT',
				'target_user': remoUser,
				'name': user.user_name,
			}));
			set({ groupChatMessage: "" })

		} catch (err) {
			console.log(err, err.message);
			return toast.error("Error on sending message, " + err.message,)
		}
	}
}))