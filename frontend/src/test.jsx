import { motion } from "motion/react"
import {axiosGroupsInstance, ip} from './lib/axios'

export function Component({ isVisible }) {

	const getData = async()=>{
		console.log('connecting to ',ip, axiosGroupsInstance.getUri());
		
		const response = await axiosGroupsInstance.get('/')
		console.log(response.data)
		
	}
	const create = async()=>{
		const name  = prompt("Enter Group Nmae")
		const response = await axiosGroupsInstance.get(`/create/${name}`)
		console.log(response.data)
	}
	const join = async () => {
		const id = prompt("Enter Group ID")
		const joinKey = prompt("Enter code to join")
		const response = await axiosGroupsInstance.get(`/join/${id}/${joinKey}`)
		console.log(response.data)
	}
	return (
		<div>
			<h2>Helo</h2>
			<center>
				<button onClick={getData}>Click for viewing all groups</button>
				<button onClick={create}>Click for  creating  groups</button><br />
				<button onClick={join}> Clicl to find</button>
			</center>
		</div>
	)
}