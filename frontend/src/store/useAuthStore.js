import {create} from 'zustand'
import  { axiosAuthInstance, axiosSpecialAuthInstance,}  from '../lib/axios.js'
import {  toast } from 'sonner';

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
			if(err.status == 401){
				return toast.error(err.response.data.error,);
			}
			toast.error("Server error")
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
				toast.error("Email already exists. Please try with a different Email",);
				
			}
			toast.error("Server error. Please try again later")
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
			toast.error("error on logging out,", );

		} finally {
			set({ isLoggginIn: false });
		}
	},
	checkAuth: async()=>{
		try {
			const res = await axiosSpecialAuthInstance.get('check-auth/')

			set({ authUser: res.data })
		} catch (err) {
			if (err.status == 401) {
				toast.error("Not Logged in !!!!",{duration:500})
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
			if(response.data.update !=0){
				set({ authUser: response.data.updated_user })
				toast.success('Profile Updated Successfully')
			}
			
		}catch(err){
			console.log(err,err.message);
			if (err.status == 400) {
				console.log("toast call");
				
				toast.error(err.response.data.error1.file[0].message,);
			}else if (err.status == 404){
				toast.error(err.response.data.error
				)
			}else{
				toast.error("Server error. Please try again later")
			}
			
		}finally{
			set({ isUpdatingProfile: false })
		}
	}
	
}))
