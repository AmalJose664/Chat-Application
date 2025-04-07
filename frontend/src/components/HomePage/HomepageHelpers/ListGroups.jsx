import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './ListGroups.css'
import { useGroupStore } from '../../../store/useGroupStore'
import { axiosGroupsInstance } from '../../../lib/axios'
import DashBoardICon from '../../../assets/DashBoardICon'
import Lock from '../../../assets/Lock'
import { getRandomColorInRange } from '../../../lib/chatUtilities'
import Refresh from '../../../assets/Refresh'


function ListGroups() {

	const availableGroups = useGroupStore(state => state.availableGroups)
	const setAvailableGroups = useGroupStore(state => state.setAvailableGroups)
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	
	const [loader,setLoader] = useState(false)
	const getGroups = async()=>{
		try{
			setLoader(true)
			const response = await axiosGroupsInstance.get('/')
			console.log(response.data)
			setAvailableGroups(response.data.groups)
		}catch(err){
			console.log(err.message, err);
		}finally{
			setLoader(false)
		}
	}
	useEffect(()=>{
		if (availableGroups.length ==0){
			getGroups()
		}

	},[])
  return (
	<div className='home-groups-container'>
		<div className="home-groups-refresh home-refresh" onClick={()=>{setAvailableGroups([]); getGroups();}}>
			<Refresh color='white'/>
		</div>
		<div className="home-groups">
			{loader && 
				  <motion.div className='list-friends-loader' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
					  < l-newtons-cradle
						  size="78"
						  speed="1.2"
						  color="white"
					  ></l-newtons-cradle >
				  </motion.div>
			}
			{availableGroups.length != 0 ? (availableGroups.map((group,i)=>{
				return (
					<div key={i} className={selectedGroup?._id == group._id ? "home-group-select-section selected" : "home-group-select-section"}>
						<EachGroup i={i} value={group} key={i} />
					</div>
				)
			})) : (!loader && <p>No Online groups Found <br />Create New Group</p>) }
			
		</div>
	</div>
  )
}

const EachGroup = React.memo(({i, value})=>{
	
	const setSelectedGroup = useGroupStore(state => state.setSelectedGroup)
	const color = value.color
	const selectGroup = (value)=>{
		value['color'] = color
		value['position'] = i
		setSelectedGroup(value)
	}
	
	return <motion.div className="home-groups-each" initial={{ opacity: 0, x: -60, }} animate={{ opacity: 1, x: 0, }}
		transition={{ duration: 0.5, delay: i / 10, ease: 'easeInOut', }}>
		<div className="home-group-container" onClick={()=>selectGroup(value)}>
			<div className="home-group">
				<div className="home-group-avatar" style={{ backgroundColor: color }}>
					{value.initial}
				</div>
				<div className="home-group-detail">
					{value.name}
				</div>
				<div className="home-group-users-in-group">
					{value.is_private && <Lock size={20} type={value.is_private} color={value.is_private ? "white" : "royalblue"} />}
					<span>{value.count}</span>
					<DashBoardICon type='profile2' size={20}/>
				</div>
			</div>
		</div>
	</motion.div>
})

export default ListGroups
