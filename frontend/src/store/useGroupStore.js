import { create } from "zustand";

export const useGroupStore = create((set,get)=> ({
	selectedGroup:null,
	connected:false,
	groupMessages:[],
	onlineUsers:[],

	setOnlineUsers:(array,len)=>{
		set({onlineUsers:array})
		set(state => {
			console.log("Updating list")
			
			const selectedGroup = state.selectedGroup
			return { availableGroups: state.availableGroups.map((group) => group._id == selectedGroup._id ? { ...group, count: len } : group) }
		})
	},
	setGroupMessages:(obj)=>{
		set(state => ({ groupMessages: state.groupMessages.concat(obj) }))
		const scrollRef = get().scrollRef
		if(scrollRef) scrollRef()
	},

	setConnected: (cond) => set(state => {
		const connected = state.connected
		if (cond != connected){
			return { connected: cond }
		}
		return state;
	}),
	
	setSelectedGroup: (obj, update)=>{
		set(state => {
			if (update){
				return { selectedGroup: obj }
			}
			const selectedGroup = state.selectedGroup
			if(obj == selectedGroup) return state
			else if(!obj){
				return { selectedGroup: null }
			}
			else if(selectedGroup?._id != obj._id){
				return { selectedGroup: obj }
			}
			return state;
		})
	},
	clearGroupMessages:()=>set({groupMessages:[]}),

	availableGroups:[],
	setAddToAvailableGrps :(obj)=>set( state => {
		if(obj){
			return { availableGroups: [obj, ...state.availableGroups] }
		}
		return state;
	}),
	setAvailableGroups:(array)=>set({availableGroups:array}),

	scrollRef:null,
	setScrollRef:(fn)=>set({scrollRef:fn})
	
}))