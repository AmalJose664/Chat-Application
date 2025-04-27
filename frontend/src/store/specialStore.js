import { create } from "zustand";
import { useChatStore } from "./useChatStore";
import { axiosApiInstance } from "../lib/axios";
import { userDataStore } from "./userDataStore";
import { toast } from "sonner";


export const useSpecialStore = create( (set,get)=>({

	selectedChatTyping:false,
	selectedChatOnline:false,


	checkSelectecUserOnline:(id)=> set(state => {
		
		//check selected user is online or typing , only for selected user title 
		const usersOnline = state.usersOnline;
		const convListTyping = state.convListTyping;
		
		
		const isOnline = !!usersOnline[id];
		const isTyping = !!convListTyping[id];
		if (isOnline === state.selectedChatOnline &&
			isTyping === state.selectedChatTyping) {
			return state;
		}
		return { selectedChatOnline: isOnline,selectedChatTyping: isTyping }
		
	}),

	socketExit:()=>set(state=>{
		return { selectedChatOnline: false, selectedChatTyping: false, convListTyping: {}, usersOnline:{}}
	}),

	convListTyping:{},

	usersOnline:{},

	selectedConvId:null,

	setSelectedConvId:(id)=>{
		return set({ selectedConvId: id })
	},

	typingChangeSelectedUser:(status)=>{
		return set({selectedChatTyping:status})
		
	},
	
	typingChangeConv:(status, user)=>{
		
		set( state => {
			const convListTyping = {...state.convListTyping}
			let hasChanges = false
			if(status){
				if (!convListTyping[user]) {
					convListTyping[user] = true
					hasChanges = true
				}
				
			}else{
				if (convListTyping[user]) {
					delete convListTyping[user] 
					hasChanges = true
				} 
			}
			
			return hasChanges ? { convListTyping: convListTyping } : state
		})
		
	},

	setUsersOnline:(onlineUsersId=[])=>{
		if(onlineUsersId.length == 0){
			set({ usersOnline: {}, convListTyping: {}, selectedChatTyping: false, selectedChatOnline: false })

			return
		}
		set(state  => {
			const currentOnlinesUsers = state.usersOnline
			
			const newOnlineIdsSet = new Set(onlineUsersId)
			const selectedChatUser = useChatStore.getState().selectedChatUser

			let hasChanges = false
			let updatedOnlineUsers = currentOnlinesUsers

			const ensureCopy = ()=>{
				if(!hasChanges){
					updatedOnlineUsers = {...currentOnlinesUsers}
					hasChanges = true
				}
			};


			Object.keys(currentOnlinesUsers).forEach(userIds => {
				if(!newOnlineIdsSet.has(userIds)){
					console.log("Update users =>", ""+userIds.slice(0, 20) + ".....");
					ensureCopy()
					delete updatedOnlineUsers[userIds]
					const typingChangeConv = get().typingChangeConv
					
					if (selectedChatUser && selectedChatUser.sqlId == userIds){
						set({ selectedChatTyping: false, selectedChatOnline :false})
					}
					typingChangeConv(false, userIds)

				}
			});

			newOnlineIdsSet.forEach(userIds => {
				const setMessageRead = get().setMessageRead
				const changeUnread = userDataStore.getState().changeUnread
				if(!currentOnlinesUsers[userIds]){
					ensureCopy()
					updatedOnlineUsers[userIds] = true
					if (selectedChatUser && selectedChatUser.sqlId == userIds){
						set({ selectedChatOnline: true })
					} 
					setMessageRead(1)
					changeUnread(userIds,1)
					
					
				}
			})
			return hasChanges ? { usersOnline: updatedOnlineUsers } : state;
		})
	},

	scrollFnRef:null,
	setScrollFnRef:(fn)=>set({scrollFnRef:fn}),

	notifications:[],
	notificationsCount:0,
	setNotiCount: (count) => set({ notificationsCount:count }),
	
	notiLoader:false,
	clearNotification: () => set({ notifications:[] }),
	setNotifications:async( value )=>{
		try{
			set({ notiLoader: true })
			const url = value == "CLEAR" ? '/notifications?value=' + value : '/notifications/'
			const response = await axiosApiInstance.get(url)
			set({notifications:response.data.Data})
		}catch(err){
			console.log(err.message, err);
			toast.error("Error loading notifications !! ",+err.message)
		}finally{
			set({ notiLoader: false })
		}
	},

	setMessageRead:(status)=>{
		const setReadMessages = useChatStore.getState().setReadMessages
		setReadMessages(status)
	},
	//----------------------------------user profilepic----------------------------------------------------------
	userData:null,
	setUserPictData:(data)=>{
		set({userData:data})
	},

	//----------------------------------user profilepic----------------------------------------------------------
	borderRef:null,
	setBorderRef:(ref) => set({borderRef:ref})
}))