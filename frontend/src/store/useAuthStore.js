import {create} from 'zustand'
import  { axiosAuthInstance, axiosSpecialAuthInstance,}  from '../lib/axios.js'
import {  toast } from 'react-toastify';

export const useAuthStore = create((set, get) => ({
	authUser:null,
	onlineUsers:[],
	isLoggginIn:false,
	isSigningUp:false,
	isLoadingGlobal:false,

	login: async(data) => {
		set({ isLoggginIn: true });
		try{
			const res = await axiosAuthInstance.post('new-signin/', data)
			localStorage.setItem("access_token", res.data.tokens.access);
			delete res.data.tokens
			set({ authUser: res.data });
			
		}catch(err){
			toast.error(err.response.data.error, {
				style: {
					background: "#000",
					color: "#fff"
				},
			});
			console.log("error on logging in,", err.response.data, " Invalid credientails");
		}finally{
			set({ isLoggginIn: false });
			console.log('finished');
			
		}
	},
	
	createUser: async(data)=>{
		set({ isSigningUp: true });
		try{
			const res = await axiosAuthInstance.post('new-signup/',data)
			localStorage.setItem("access_token", res.data.tokens.access);
			console.log(res.data);
			delete res.data.tokens
			set({ authUser: res.data });
			
		}catch(err){
			console.log(err,"======", err.message);
			if(err.status == 400){
				console.log("email exists with this id chose another", err.response.data.email[0]);
				toast.error("Email already exists. Please try with a different Email", {
					style: {
						background: "#000",
						color: "#fff"
					},
				});
				
			}
			
		}finally{
			set({ isSigningUp: false });
		}
		
	},
	logout: async () => {
		set({ isLoggginIn: true });
		try {
			const res = await axiosAuthInstance.get('logout/')
			set({ authUser: null });
			localStorage.removeItem('access_token')
		} catch (err) {
			console.log("error on logging out,", err.message);

		} finally {
			set({ isLoggginIn: false });
		}
	},
	checkAuth: async()=>{
		try {
			const res = await axiosSpecialAuthInstance.get('check-auth/')
			//console.log(res.data);
			set({ authUser: res.data })
		} catch (err) {
			if (err.status == 401) {
				console.log("Not authenticated Please log in");
			}
		}
	},
	isUpdatingProfile:false,

	updateProfile: async(data)=>{
		try{
			set({ isUpdatingProfile :true})
			console.log("Fetching");
			const response = await axiosSpecialAuthInstance.post('update/', data,{
				headers: { "Content-Type": "multipart/form-data" },
			})
			if (response.data.profile_update ==1){
				toast.success('Profile Updated Successfully', {
					style: {
						background: "#000",
						color: "#fff"
					},
				});
			}
			console.log(response.data);	
			
			if(response.data.update !=0){
				set({ authUser: response.data.updated_user })
			}
			
		}catch(err){
			console.log(err,err.message);
			if (err.status == 400) {
				console.log("toast call");
				
				toast.error(err.response.data.error1.file[0].message, {
					style: {
						background: "#000",
						color: "#fff"
					},
				});
			}
			
		}finally{
			set({ isUpdatingProfile: false })
		}
	}
	
}))
