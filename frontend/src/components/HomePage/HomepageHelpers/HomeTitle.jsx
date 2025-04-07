import React, { useRef, useState } from 'react'
import DashBoardICon from '../../../assets/DashBoardICon'
import NotificationBox from './HomeUtils/NotificationBox'
import { Link } from 'react-router-dom'
import Notification from '../../../assets/Notification'
import { useSpecialStore } from '../../../store/specialStore'
import { useChatStore } from '../../../store/useChatStore'
import ShowProfile from './HomeUtils/ShowProfile'

const HomeTitle = ({showInterface}) => {
	const [showNotifctns, setShowNotifctns]  = useState(false)
	const notificationsCount = useSpecialStore(state => state.notificationsCount)
	const outSideRef = useRef(null);
	const chatSocket = useChatStore(state => state.chatSocket);

	const userData = useSpecialStore(state => state.userData)
	const border = useSpecialStore(state => state.borderRef)
  return (
	  <div className="home-second-box">
		<div className="home-messgage-title" onClick={()=>border.current.classList.toggle('animate')
		}>
			{showInterface}
		</div>
		
		<div ref={outSideRef} className={showNotifctns ? "home-title-notifications-icon turned-on" :"home-title-notifications-icon"} onClick={(e)=>{ setShowNotifctns(!showNotifctns); e.stopPropagation()}}>
		<Notification color='white'/>
			{notificationsCount != 0 && <span className="number-of-request">
			{notificationsCount}
			</span>}
			<div style={{ minHeight: '40px', minWidth: '40px', borderRadius: '50%', background: chatSocket ? 'royalblue' : 'grey' }}>
			</div>
		</div>
		{userData && <ShowProfile/>}
		{showNotifctns && <NotificationBox outRef={outSideRef} onClose={() => setShowNotifctns(false)} />}
		<Link to="/friends/add">
			<div className="home-add-new">
				<DashBoardICon size={30} type='add' />
			</div>
		</Link>

	  </div>
  )
}

export default HomeTitle