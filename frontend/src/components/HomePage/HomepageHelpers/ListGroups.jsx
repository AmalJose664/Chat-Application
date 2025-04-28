import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './ListGroups.css'
import { useGroupStore } from '../../../store/useGroupStore'
import DashBoardICon from '../../../assets/DashBoardICon'
import Lock from '../../../assets/Lock'
import Refresh from '../../../assets/Refresh'


function ListGroups() {

	const availableGroups = useGroupStore(state => state.availableGroups)
	const setAvailableGroups = useGroupStore(state => state.setAvailableGroups)
	const selectedGroup = useGroupStore(state => state.selectedGroup)
	
	const getGroups = useGroupStore(state => state.getGroups)
	const groupLoader = useGroupStore(state => state.groupLoader)

	const searchGroups = useGroupStore(state => state.searchGroups)


	const [searchKey, setSearchKey] = useState('')

	useEffect(()=>{
		if (availableGroups.length ==0){
			getGroups()
		}

	},[])
	useEffect(()=>{
		if(!searchKey) return
		const debounce = setTimeout(() => {
			getGroups(searchKey)
		}, 780);
		return ()=>clearTimeout(debounce)
	},[searchKey])
		
  return (
	<div className='home-groups-container'>
		<div className="home-refresh" onClick={()=>{setAvailableGroups([]); getGroups();}}>
			<Refresh color='white'/>
		</div>
		<div className="home-groups">
			<AnimatePresence>
				  {searchGroups && <motion.div className="home-search-group"
					  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }} exit={{ opacity: 0, y: -20 }}
				 		 >
					  <input type="text" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} placeholder='search for groups....' />
				  </motion.div>}
			</AnimatePresence>
			{groupLoader && 
				  <motion.div className='list-friends-loader' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
					  < l-tail-chase
						  size="26"
						  speed="1.8"
						  color="white"
					  ></l-tail-chase >
				  </motion.div>
			}
			  {!groupLoader && 
				  availableGroups.length != 0 ? (availableGroups.map((group, i) => {
					  return (
						  <div key={i} className={selectedGroup?._id == group._id ? "home-group-select-section selected" : "home-group-select-section"}>
							  <EachGroup i={i} value={group} key={i} />
						  </div>
					  )
				  })) : (!groupLoader && <p style={{ textAlign: 'center' }}>No Online groups Found <br />Create New Group</p>)
			   }
			
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
