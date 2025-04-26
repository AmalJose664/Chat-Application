import React from 'react'
import DashBoardICon from '../../../assets/DashBoardICon'
import './SideBar.css'
import { Link, useNavigate } from 'react-router-dom'

function SideBar({ setTab, tab }) {
	const navigate = useNavigate()

	
	return (
	<div className='home-sidebar'>
		<div className="side-contents">
			<div className="side-option">
				<Link to={'/'} className="home-side-option-cont">
					  <div className="home-side-svg">
						  <DashBoardICon type='dash' />
						  <DashBoardICon type='dash2' />
					  </div>
					  <div className="home-side-text">
						  DashBoard 
					  </div>
				</Link>
			</div>
				<div className={tab === 'Chats' ? "side-option selected" : "side-option "} onClick={() => { setTab('Chats'); navigate('/home/chats', { replace: true }); }}>
				  <div className="home-side-option-cont" >
					  <div className="home-side-svg">
						  <DashBoardICon type='chat' />
						  <DashBoardICon type='chat2' />
					  </div>
					  <div className="home-side-text">
						  Chats
					  </div>
				  </div>
			  </div>
				<div className={tab === 'groups' ? "side-option selected" : "side-option "} onClick={() => { setTab('Groups'.toLowerCase()); navigate('/home/groups', { replace: true }); }}>
				  <div className="home-side-option-cont">
					  <div className="home-side-svg">
						  <DashBoardICon type='group' />
						  <DashBoardICon type='group2' />
					  </div>
					  <div className="home-side-text">
						  Groups
					  </div>
				  </div>
			  </div>
			  <div className="side-option">
				  <Link  to={`/profile/${tab}`} className="home-side-option-cont">
					  <div className="home-side-svg">
						  <DashBoardICon type='profile' />
						  <DashBoardICon type='profile2' />
					  </div>
					  <div className="home-side-text">
						  Profile
					  </div>
				  </Link>
			  </div>
			  <div className="side-option">
				  <Link  to={`/friends?back=${tab}`} className="home-side-option-cont">
					  <div className="home-side-svg">
						  <DashBoardICon type='add' />
						  <DashBoardICon type='profile2' />
					  </div>
					  <div className="home-side-text">
						  Friends
					  </div>
				  </Link>
			  </div>
			  <div className="side-option">
				   <Link to={`/settings/${tab}`} className="home-side-option-cont">
					  
					  <div className="home-side-svg">
						  <DashBoardICon type='setting1' />
						  <DashBoardICon type='setting2' />
					  </div>
					  <div className="home-side-text">
						 Settings
					  </div>
				  </Link>
			  </div>
			  
		</div>
	</div>
  )
}

export default SideBar
