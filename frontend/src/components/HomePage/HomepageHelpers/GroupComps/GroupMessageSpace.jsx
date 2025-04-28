import React, { useEffect, useRef, useState } from 'react'
import { useGroupStore } from '../../../../store/useGroupStore'
import './GroupMessageSpace.css'
import GroupMessageComp from './GroupMessageComp'
import DashBoardICon from '../../../../assets/DashBoardICon'
import { AnimatePresence, motion } from 'framer-motion'
import { axiosGroupsInstance } from '../../../../lib/axios'
import { toast } from 'sonner';
import Lock from '../../../../assets/Lock'
import { useGroupConnectStore } from '../../../../store/useGroupConnect'
import { useSpecialStore } from '../../../../store/specialStore'


const GroupMessageSpace = () => {
	
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	const connected = useGroupStore(state => state.connected)
	const deleteSocket = useGroupConnectStore(state => state.deleteSocket)
	const clearGroupMessages = useGroupStore(state => state.clearGroupMessages)
	const setConnected = useGroupStore(state => state.setConnected)
	const setOnlineUsers = useGroupStore(state => state.setOnlineUsers)

	const isFirstRender = useRef(true);
	useEffect(()=>{
		
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		
		if(connected){
			deleteSocket()
			clearGroupMessages()
			setOnlineUsers([])
			setConnected(false)
		}
		
	}, [selectedGroup])
	const borderRef = useSpecialStore(state => state.borderRef)
	useEffect(()=>{
		let timer
		if(connected){
			borderRef.current.classList.toggle('green')
			timer = setTimeout(() => borderRef.current.classList.toggle('green'),9990)
		}
		return () => {
			if(borderRef && borderRef.current) borderRef.current.classList.remove('green')
			clearTimeout(timer)
		}
	},[connected])

	return (

		<div className="home-message-component">
			<AnimatePresence>
				{(connected && selectedGroup) && <GroupMessageComp />}
			</AnimatePresence>
		  {!connected && <div className='home-group-create-or-join'>
			  <AnimatePresence>
				  {!connected && <CreateGroup />}
			  </AnimatePresence>

			  <AnimatePresence>
				  {(!connected && selectedGroup) && <JoinToGroup selectedGroup={selectedGroup} />}
			  </AnimatePresence>
		  </div>}
		
		</div>
  )
}

function JoinToGroup({ selectedGroup }){
	const [loader, setLoader] = useState(false)
	

	const setSelectedGroup = useGroupStore(state => state.setSelectedGroup)
	const setGroupSocket = useGroupConnectStore(state => state.setGroupSocket)

	const [joinKey, setJoinKey] = useState(selectedGroup.is_private ? '' : '0000-0000')
	
	const handleJoin = async(e)=>{
		e.preventDefault()
		if(!selectedGroup){
			return toast.info("Select a group to Join")
		}
		try{
			setLoader(true)
			if(!joinKey) return
			
			const response = await axiosGroupsInstance.get(`/join/${selectedGroup._id}/${joinKey}`)

			setSelectedGroup(response.data.group_data, true)
			setGroupSocket(response.data.group_data.group_key, response.data.group_data.join_key)
			setJoinKey("")
			toast.success("Connected !!")
		}catch(err){
			if(err.status == 403){
				toast.error("Invalid Join Key",{duration:3000})
			}else if(err.status==404){
				toast.error("Group Not Found", { duration: 2000 })
			}
			else{
				console.log(err);
				toast.error("Error joining group !! "+err.message, { duration: 2000 })
			}
			
		}finally{
			setLoader(false)
		}
	}

	return (
		<motion.div className='home-group-join-to' 
			initial={{ opacity: 0, y: 60, }} animate={{ opacity: 1, y: 0, }}
			transition={{ duration: .5, ease: 'backIn' }} exit={{ opacity: 0, y:60 }}
		>
			<div className="h-g-create-inner join">
				<div className="home-group-join-close" onClick={() => setSelectedGroup(null)}>
					&times;
				</div>
				<div className="title-home-create">
					<div className="h-c-inner-svg">
						<DashBoardICon type='group' color='royalblue' />
					</div>
					<h2 >Join to '{selectedGroup?.name}' </h2>
				</div>
				<div className="h-g-create-inner-content">
					<form className="h-g-create-content-inner" onSubmit={handleJoin}>
						{selectedGroup?.is_private && <div className="h-g-create-input">
							<label htmlFor="">Join Key</label><br />
							<input required maxLength={50} value={joinKey} onChange={(e) => setJoinKey(e.target.value)}
								type="text" className='group-input-name' placeholder='#0000-0000?' />
						</div>}
						<div className="h-g-create-input">
							{loader ? <motion.div className="home-group-loader"
								initial={{ opacity: 0, y: -5, }} animate={{ opacity: 1, y: 0, }}
								transition={{ duration: .1, ease: 'anticipate' }}
							>
								< l-dot-spinner
									size="30"
									speed="0.9"
									color="white"
								></l-dot-spinner>
							</motion.div> : <motion.input type="submit" value={' Join'} className='group-input-btn'
								initial={{ opacity: 0, y: 10, }} animate={{ opacity: 1, y: 0, }}
								transition={{ duration: .1, ease: 'anticipate' }}
							/>}


						</div>
					</form>
				</div>
			</div>
		</motion.div>
	)
}

function CreateGroup(){
	const [formData,setFormData] = useState({ groupName:"", isLocked:false })
	const [loader, setLoader] = useState(false)
	const formRef = useRef(null)
	
	const setAddToAvailableGrps = useGroupStore(state => state.setAddToAvailableGrps)
	const setGroupSocket = useGroupConnectStore(state => state.setGroupSocket)
	const setSelectedGroup = useGroupStore(state => state.setSelectedGroup)

	const handleFrom = async(e)=>{
		if(formData.groupName.length<6) return toast.error("Group Name should be more than 6 Charectors")
		e.preventDefault()
		try{
			setLoader(true)
			const response = await axiosGroupsInstance.get(`/create/${formData.groupName}/${!formData.isLocked ? 1 : 0}/`)

			formRef.current.reset()
			setAddToAvailableGrps(response.data.group_data)
			setSelectedGroup(response.data.group_data, true)
			setGroupSocket(response.data.group_data.group_key, response.data.group_data.join_key)
			toast.success("Connected !!")
		}
		catch(err){
			if (err.status == 400) {
				toast.error("Group Name not Available", { autoClose: 3000, })
			}
			console.log(err);
			toast.error("Error creating group !! " + err.message, { duration: 2000 })
			
		}finally{
			setLoader(false)
		}
		

	}
	return (
		<motion.div className='home-g-create-div' initial={{ opacity: 0, y: 60, }} animate={{ opacity: 1, y: 0, }}
			transition={{ duration: .5 }} exit={{ opacity: 0, y: 60, }}>
			<div className="h-g-create-inner">
				<div className="title-home-create">
					<div className="h-c-inner-svg" >
						<DashBoardICon type='group' color='royalblue'/>
					</div>
					<h2>Create New Group</h2>
				</div>
				<div className="h-g-create-inner-content">
					<form className="h-g-create-content-inner" onSubmit={handleFrom} ref={formRef}>
						<div className="h-g-create-input">
							<label htmlFor="">Group Name</label><br />
							<input required maxLength={50}  value={formData.groupName} onChange={(e) => setFormData({ ...formData, groupName: e.target.value })} 
							type="text" className='group-input-name' placeholder='What Makes u Together?' />
						</div>
						<div className="h-g-content-private">
							<input type="checkbox" onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}/>
							<label htmlFor="">Make This Group Private <Lock type={formData.isLocked}/></label>
						</div>
						<div className="h-g-create-input">
							{loader ? <motion.div className="home-group-loader" 
							initial={{ opacity: 0, y: -5, }} animate={{ opacity: 1, y: 0, }} 
							transition={{ duration: .1, ease:'anticipate' }}
							>
								< l-dot-spinner
									size="30"
									speed="0.9"
									color="white"
								></l-dot-spinner>
							</motion.div> : <motion.input type="submit" value={'Create Group'} className='group-input-btn' 
									initial={{ opacity: 0, y: 10, }} animate={{ opacity: 1, y: 0, }}
									transition={{ duration: .1, ease: 'anticipate' }}
							/>}
							
							
						</div>
					</form>
				</div>
			</div>
		</motion.div>
	)
}
export default GroupMessageSpace
