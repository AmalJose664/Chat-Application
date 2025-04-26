import React, { useRef, useState } from 'react'
import DashBoardICon from '../../../assets/DashBoardICon'
import NotificationBox from './HomeUtils/NotificationBox'
import { Link } from 'react-router-dom'
import Notification from '../../../assets/Notification'
import { useSpecialStore } from '../../../store/specialStore'
import ShowProfile from './HomeUtils/ShowProfile'
import Search from '../../../assets/Search'
import { useGroupStore } from '../../../store/useGroupStore'

const HomeTitle = ({ showInterface, back }) => {
	const [showNotifctns, setShowNotifctns]  = useState(false)
	const notificationsCount = useSpecialStore(state => state.notificationsCount)
	const outSideRef = useRef(null);

	const userData = useSpecialStore(state => state.userData)
	const border = useSpecialStore(state => state.borderRef)

	const setSeachGroups = useGroupStore(state => state.setSeachGroups)
  return (
	  <div className="home-second-box">
		<div className="home-messgage-title" onClick={()=>border.current.classList.toggle('green')
		}>
			{showInterface}
		</div>
		  {(showInterface == 'Groups'|| showInterface == 'groups' )&& <div className="home-group-search-icon" onClick={()=>setSeachGroups()}>
			<Search />
		</div>}
		
		<div ref={outSideRef} className={showNotifctns ? "home-title-notifications-icon turned-on" :"home-title-notifications-icon"} onClick={(e)=>{ setShowNotifctns(!showNotifctns); e.stopPropagation()}}>
		<Notification color='white'/>
			{notificationsCount != 0 && <span className="number-of-request">
			{notificationsCount}
			</span>}
			
		</div>
		{userData && <ShowProfile/>}
		{showNotifctns && <NotificationBox outRef={outSideRef} onClose={() => setShowNotifctns(false)} />}
		<Link to={`/friends/add?back=${back}`}>
			<div className="home-add-new">
				<DashBoardICon size={30} type='add' />
			</div>
		</Link>

	  </div>
  )
}

export default HomeTitle