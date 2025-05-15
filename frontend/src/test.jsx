
import {axiosGroupsInstance, ip} from './lib/axios'
import { toast } from 'sonner';
import SonnerIcons from './assets/SonnerIcons';
import { useAuthStore } from './store/useAuthStore';
import {  useNavigate } from 'react-router-dom'

export function Component({ isVisible }) {

	const authUser  = useAuthStore(state=>state.authUser)
	if(!authUser.user.is_staff){
		const navigate = useNavigate()
		return (
			<div className="" style={{display:'flex',alignItems:'center',marginTop:'25%',flexDirection:'column'}}>
				Not a staff ? , cant visite the page {':('}  <br /> 
				<span style={{textDecoration:'underline'}} onClick={() => navigate(-1)}>
					Go back
				</span> 
				
			</div>
		)
	}
	const getData = async()=>{
		console.log('connecting to ',ip, axiosGroupsInstance.getUri());
		
		const response = await axiosGroupsInstance.get('/')
		console.log(response.data)
		
	}
	const create = async()=>{
		const name  = prompt("Enter Group Nmae")
		const response = await axiosGroupsInstance.get(`/create/${name}/0`)
		console.log(response.data)
	}
	const join = async () => {
		const id = prompt("Enter Group ID")
		const joinKey = prompt("Enter code to join")
		const response = await axiosGroupsInstance.get(`/join/${id}/${joinKey}`)
		console.log(response.data)
	}
	const show = async()=>{
		const name = prompt("name")
		const response = await axiosGroupsInstance.get(`/users/${name}`)
		console.log(response.data)
	}

	


	const soner =()=>{
		toast.success('A Sonner toast', {
			className: 'my-classname',
			description: 'With a description and an icon',
			duration: 5000,
		});
	}
	const sonerInfo = () => {
		toast.info('A Sonner toast', {
			className: 'my-classname',
			description: 'With a description and an icon',
			duration: 5000,
		});
	}
	const sonerWarr = () => {
		toast.warning('A Sonner toast', {
			className: 'my-classname',
			description: 'With a description and an icon',
			duration: 5000,
			
		});
	}
	const sonerErr = () => {
		toast.error('A Sonner toast', {
			className: 'my-classname',
			description: 'With a description and an icon',
			duration: 5000,
		});
	}
	
	return (
		<div>
			<h2>Helo</h2>
			<center>
				<button style={{margin:'30px',padding:'20px'}} onClick={getData}>Click for viewing all groups</button>
				<button style={{margin:'30px',padding:'20px'}} onClick={create}>Click for  creating  groups</button><br />
				<button style={{margin:'30px',padding:'20px'}} onClick={join}> Clicl to find</button>
				<button style={{margin:'30px',padding:'20px'}} onClick={show}> Clicl to show users</button>


			</center>
			<div>
				Sonner button
				<button onClick={soner}>
					Sonner Tick
				</button>
				<button onClick={sonerErr}>
					Sonner Errr
				</button>
				<SonnerIcons type='error' color='white' size={156} />
				<button onClick={sonerInfo}>
					Sonner Info
				</button>
				<button onClick={sonerWarr}>
					Sonner warning
				</button>
			</div>
			
		</div>
	)
}
