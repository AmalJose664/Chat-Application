import React from 'react'
import DashBoardICon from '../../../assets/DashBoardICon'
import './SideBar.css'
import { Link } from 'react-router-dom'

function SideBar({ setTab, tab }) {
	
	return (
	<div className='home-sidebar'>
		<div className="side-contents">
			<div className="side-option">
				<div className="home-side-option-cont">
					  <div className="home-side-svg">
						  <DashBoardICon type='dash' />
						  <DashBoardICon type='dash2' />
					  </div>
					  <div className="home-side-text">
						  DashBoard 
					  </div>
				</div>
			</div>
			  <div className={tab === 'users' ? "side-option selected" : "side-option " }   onClick={() => { setTab('users') }}>
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
			  <div className={tab === 'groups' ? "side-option selected" : "side-option "} onClick={() => { setTab('groups') }}>
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
				  <Link to='/profile' className="home-side-option-cont">
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
				   <Link to="/settings" className="home-side-option-cont">
					  
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
