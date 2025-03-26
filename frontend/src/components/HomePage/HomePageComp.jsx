import React, { useEffect, useRef, useState } from 'react'
import Logo from '../../assets/Logo'
import './HomePageComp.css'
import SideBar from './HomepageHelpers/SideBar'
import { useAuthStore } from '../../store/useAuthStore'
import ListGroups from './HomepageHelpers/ListGroups'
import ListUsers from './HomepageHelpers/ListUsers'
import {Link} from 'react-router-dom'
import SelectedUserTitle from './HomepageHelpers/SelectedUserTitle'
import MessageSpace from './HomepageHelpers/MessageComponents/MessageSpace';
import { motion } from 'framer-motion';
import HomeTitle from './HomepageHelpers/HomeTitle';
import { useSpecialStore } from '../../store/specialStore'
import GroupMessageSpace from './HomepageHelpers/GroupComps/GroupMessageSpace'
import SelectedGroup from './HomepageHelpers/GroupComps/SelectedGroup'

function HomePageComp() {
	const [viewItem , setViewItem] = useState('users')
	const {authUser} = useAuthStore()
	const borderRef = useRef(null)
	const setBorderRef = useSpecialStore(state => state.setBorderRef)
	useEffect(()=>{
		const borderTime = setTimeout(() => {
			setBorderRef(borderRef)
		}, 700);
		return ()=> clearTimeout(borderTime)
	})
  return (
	<div className='homepage-component'>
		<div className="home-content-container">
			<div className="sections" ref={borderRef}>
				<div className="home-content home-title">
					<div className="home-logo">
						<div className="in-content">
							<h3>
								Me Chat... <Logo color='white' size={35}/>
							</h3>
						</div>
					</div>
				</div>

				<div className="home-content home-list-title">
					<HomeTitle/>
				</div>
				<div className="home-content home-user-title">
					<div className="home-selected-chat">
						<div className="selected-chat-in">
							{viewItem === 'users' ?<SelectedUserTitle/> : <SelectedGroup/> }
						</div>
					</div>
				</div>
				<div className="home-content home-options">
					<div className="options-list">
						<div className="in-options">
							<SideBar setTab= {setViewItem} tab={viewItem} />
							 
						</div>
					</div>
					{authUser && <motion.div className='home-sidebar-profile-icon' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.4 }}>
						<div className="h-s-p-i-inner">
							<Link to={'/profile'} className="h-s-p-i-inner2">
								<div className="h-s-p-i-image">
									<img src={authUser.db_user.profile_picture} alt="Image" />
								</div>
								<div className="h-s-p-i-title">
									{authUser.db_user.user_name}
								</div>
							</Link>
						</div>
					</motion.div>}
				</div>
				<div className="home-content home-list-user">
					<div className="in-list-userorgroup">
						{viewItem === 'users' ? <ListUsers /> : <ListGroups/> }
					</div>
				</div>
				<div className="home-content home-message">
					<div className="home-message-box">
						<div className="home-chat-box">
							{viewItem === 'users' ?<MessageSpace/> : <GroupMessageSpace/> }
							  
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
  )
}

export default HomePageComp


