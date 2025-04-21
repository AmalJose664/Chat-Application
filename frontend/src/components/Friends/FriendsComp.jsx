import React, {  useEffect, useState } from 'react'
import './Friends.css'
import {motion} from 'framer-motion'
import AddFriends from './AddFriends'
import MyFriends from './MyFriends'
import Requests from './Requests'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'



function FriendsComp() {
	const navigate = useNavigate()
	const [tab, setTab] = useState('added')
	const { tabType } = useParams()

	const [params] = useSearchParams()
	const backTab = params.get("back")
	
	
	useEffect(()=>{
		if (tabType == 'my-friends'){
			setTab('added')
		} else if (tabType == 'requests') {
			setTab('requests')
		} else if (tabType == 'add') {
			setTab('add')
		}
	},[])
	console.log(backTab);
	
  return (
	<div>
	  <motion.div className="friends-component" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 ,delay:.1}}>
		<div className="friends-inner">
			<div className="friends-select">
				<div className="friends-select-inner">
						<span className={tab == 'add' ? 'friends-home-selector selected' : 'friends-home-selector'} 
							  onClick={() => { setTab('add'); navigate('/friends/add?back=' + backTab, { replace: true }); }}
						> Add New Friends </span>
						<span className={tab == 'requests' ? 'friends-home-selector selected' : 'friends-home-selector'} 
							  onClick={() => { setTab('requests'); navigate('/friends/requests?back=' + backTab, {replace: true }); }}
						> Friend Requests </span>
						<span className={tab == 'added' ? 'friends-home-selector selected' : 'friends-home-selector'} 
							  onClick={() => { setTab('added'); navigate('/friends/my-friends?back=' + backTab, {replace: true }); }}
						> View My Friends </span>
				</div>
				
			</div>
			<div className="frinds-sections">
				{tab == "add" ? <AddFriends/> : ""}
				{tab == 'added' ? <MyFriends /> : ""}
				{tab == 'requests' ? <Requests/>  : ""}
				 
			</div>
		</div>
	  </motion.div>
		  <Link to={`/home/${backTab == 'chats' ? 'chats' : 'groups'}`} className="profile-page-go-back-btn">
			  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
				  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
			  </svg>
		  </Link>
	</div>
  )
}




export default FriendsComp
