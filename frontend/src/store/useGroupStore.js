import { create } from "zustand";

export const useGroupStore = create((set,get)=> ({
	selectedGroup:null,
	connected:false,
	groupMessages:[],

	setGroupMessages:(obj)=>{
		set(state => ({ groupMessages: state.groupMessages.concat(obj) }))
	},

	setConnected: (cond) => set(state => {
		const connected = state.connected
		if (cond != connected){
			return { connected: cond }
		}
	}),
	
	setSelectedGroup: (obj)=>{
		set(state => {
			const selectedGroup = state.selectedGroup
			if(obj == selectedGroup) return state
			else if(!obj){
				return { selectedGroup: obj }
			}
			else if(selectedGroup?._id != obj._id){
				return { selectedGroup: obj }
			}
		})
	},

	availableGroups:[],
	setAddToAvailableGrps :(obj)=>set( state => {
		if(obj){
			return { availableGroups: [obj, ...state.availableGroups] }
		}
	}),
	setAvailableGroups:(array)=>set({availableGroups:array})
	
}))