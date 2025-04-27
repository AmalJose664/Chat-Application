import { create } from 'zustand'
import { useSpecialStore } from './specialStore';


export const userDataStore = create( (set,get) => ({
	selectedUser: null,
	conversations: [],

	userFriends:[],
	tempSelectedUser:null,
	setUserFriends:(list) => {
		set({userFriends:list})
	},
	setTempSelectedUser:(obj)=>{
		set({ tempSelectedUser: obj });
	},

	setSelectUser: (user) =>{
		const curentUser = get().selectedUser
		const setSelectedConvId = useSpecialStore.getState().setSelectedConvId
		if (!curentUser || curentUser.id !== user.id){
			set({ selectedUser: user });
			setSelectedConvId(user.conv_id)
		}
		
	},
	clearSelectedUserDataStore:()=>{
		const curentUser = get().selectedUser
		const setSelectedConvId = useSpecialStore.getState().setSelectedConvId
		if(curentUser){
			set({ selectedUser: null });
			setSelectedConvId(null)
		}
		
	},
	setConversationsStore: (list,unsen) => {
		const setNotiCount = useSpecialStore.getState().setNotiCount
		set({ conversations: list });
		setNotiCount(unsen)
	},
//---------------------for showing message details----------------------------------------------------------------------------
	

	showMessageId:null,


	setMessageId:(id)=>{
		set({showMessageId:id})
	},
//-----------------------------------------------------------------------------------------------------------------------------
	bringConvsToTop:(id) =>{
		
		if (!id) return;
		const conversations = get().conversations
		try{
			const index = conversations.findIndex(conv => conv.other_user._id === id)
			if (index <= 0) return
			const newConv = [...conversations]
			const [itemToMove] = newConv.splice(index, 1)
			newConv.unshift(itemToMove)
			set({ conversations: newConv })
		}
		catch(err){
			console.log(err, err.messsage, "!!!!Cant Change conv order");
		}
	},


	incrmtUnreadAndLstm:(userId,message)=>{
		
		set(state => ({
			conversations: state.conversations.map((conv) =>
				conv.other_user._id === userId ? {
					...conv,
					unread_count: Number(conv.unread_count || 0) + 1,
					lst_m: message
				}
					: conv
			)
		}))

	},
	updateLastMessage: (convId, message, status)=>{
		if (!convId) return
		set(state => ({
			conversations: state.conversations.map((convs)=> 
				convs._id === convId ? {
					...convs,
					lst_m: message,
					l_s:status,
					t: new Date().toISOString()
				}
				:
				convs
			)
		}))
	},

	clearUnread:(key,) => {
		set(state => ({
			conversations:state.conversations.map((object, i)=> i===key ? {...object, unread_count:0 } : object)
		}))
	},
	changeUnread: (otherUId,status=0) => {
		if(status == 1 || status ==2){
			
			return set(state => ({
				conversations: state.conversations.map((object) => {
					
					return object.other_user.sqlite_id == otherUId ? { ...object, l_s: status } : object
				})
			}))
		}
		
	}
}))


