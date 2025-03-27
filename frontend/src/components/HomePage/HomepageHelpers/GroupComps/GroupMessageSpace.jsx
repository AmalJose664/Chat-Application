import React, { useEffect, useState } from 'react'
import { useGroupStore } from '../../../../store/useGroupStore'
import './GroupMessageSpace.css'
import GroupMessageComp from './GroupMessageComp'
import DashBoardICon from '../../../../assets/DashBoardICon'
import { AnimatePresence, motion } from 'framer-motion'
import { axiosGroupsInstance } from '../../../../lib/axios'
import { toast, ToastContainer, Flip } from 'react-toastify';
import Lock from '../../../../assets/Lock'


const GroupMessageSpace = () => {
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	const connected = useGroupStore(state => state.connected)
  return (

		<div className="home-message-component">
			<AnimatePresence>
				{(connected && selectedGroup) && <GroupMessageComp />}
			</AnimatePresence>
			<div className='home-group-create-or-join'>
			  	<AnimatePresence>
					{!connected && <CreateGroup />}
				</AnimatePresence>

			  	<AnimatePresence>
					{selectedGroup && <JoinToGroup selectedGroup={selectedGroup} />}
				</AnimatePresence>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={800}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Flip}
				/>
		</div>
  )
}

function JoinToGroup({ selectedGroup }){
	const [loader, setLoader] = useState(false)
	const [joinKey, setJoinKey] = useState('')
	const setSelectedGroup = useGroupStore(state => state.setSelectedGroup)
	const setConnected = useGroupStore(state => state.setConnected)

	const handleJoin = async(e)=>{
		e.preventDefault()
		if(!selectedGroup){
			return toast.info("Select a group to Join")
		}
		try{
			setLoader(true)
			if(!selectedGroup.is_private) setJoinKey("0000-0000")
			const response = await axiosGroupsInstance.get(`/join/${selectedGroup._id}/${joinKey}`)
			console.log(response.data)
		}catch(err){
			if(err.status == 403){
				toast.error("Invalid Join Key",{autoClose:3000})
			}else{
				console.log(err);
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
					<div className="h-c-inner-svg" onClick={() => setConnected(true)}>
						<DashBoardICon type='group' color='royalblue' />
					</div>
					<h2 >Join to {selectedGroup?.name} </h2>
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
								< l-tail-chase
									size="26"
									speed="2.4"
									color="white"
								></l-tail-chase >
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
	
	const setAddToAvailableGrps = useGroupStore(state => state.setAddToAvailableGrps)

	const handleFrom = async(e)=>{
		e.preventDefault()
		try{
			setLoader(true)
			const response = await axiosGroupsInstance.get(`/create/${formData.groupName}/${!formData.isLocked ? 1 : 0}/`)
			console.log(response.data);
			setAddToAvailableGrps(response.data.group_data)
			
		}
		catch(err){
			if (err.status == 400) {
				toast.error("Group Name not Available", { autoClose: 3000, })
			}
			console.log(err);
			
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
					<form className="h-g-create-content-inner" onSubmit={handleFrom}>
						<div className="h-g-create-input">
							<label htmlFor="">Group Name</label><br />
							<input required maxLength={50} value={formData.groupName} onChange={(e) => setFormData({ ...formData, groupName: e.target.value })} 
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
								< l-tail-chase
									size="26"
									speed="2.4"
									color="white"
								></l-tail-chase >
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
