import axios from 'axios'


export let ip = 'localhost'

export let proto = location.protocol != 'http:' ? "https" : "http"
export let wsProto = location.protocol != 'http:' ? "wss" : "ws"
if (ip == 'localhost' || ip == '192.168.253.21' ){
	ip=ip+":8000"
	proto = "http"
	wsProto = 'ws'

}
const axiosInstance = axios.create({
	baseURL: `${proto}://${ip}/api/friends`,
	headers:{
		Authorization: localStorage.getItem('access_token') || ''
	},
	withCredentials:true
})

axiosInstance.interceptors.request.use( config => {
	const token = localStorage.getItem('access_token') || null;
	if (token){
		config.headers.Authorization = `Bearer ${token || ""}`
	}
	return config

})

export const axiosApiInstance = axiosInstance
export const axiosAuthInstance = axios.create({
	baseURL: `${proto}://${ip}/api/auth`,
	
	withCredentials: true
})

export const axiosMessageInstance = axios.create({
	baseURL: `${proto}://${ip}/api/messages`,
	headers: {
		Authorization: localStorage.getItem('access_token') || ''
	},
	withCredentials: true
})
axiosMessageInstance.interceptors.request.use(config => {
	const token = localStorage.getItem('access_token') || null;
	if (token) {
		config.headers.Authorization = `Bearer ${token || ""}`
	}
	return config

})

export const axiosGroupsInstance = axios.create({
	baseURL: `${proto}://${ip}/api/groups`,
	headers: {
		Authorization: localStorage.getItem('access_token') || ''
	},
	withCredentials: true
})

axiosGroupsInstance.interceptors.request.use(config => {
	const token = localStorage.getItem('access_token') || null;
	if (token) {
		config.headers.Authorization = `Bearer ${token || ""}`
	}
	return config

})


export const axiosSpecialAuthInstance = axios.create({
	baseURL: `${proto}://${ip}/api/auth`,
	headers: {
		Authorization: localStorage.getItem('access_token') || ''
	},
	withCredentials: true
})

axiosSpecialAuthInstance.interceptors.request.use(config => {
	const token = localStorage.getItem('access_token') || null;
	if (token) {
		config.headers.Authorization = `Bearer ${token || ""}`
	}
	return config

})