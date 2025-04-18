import React, { useEffect, useRef } from 'react'
import "./NotificationBox.css"
import { motion } from 'framer-motion'
import { useSpecialStore } from '../../../../store/specialStore'
import { filterNotifications } from '../../../../lib/chatUtilities'

const NotificationBox = ({ onClose, outRef }) => {
	const setNotifications = useSpecialStore(state => state.setNotifications)
	const notifications = useSpecialStore(state => state.notifications)
	const notiLoader = useSpecialStore(state => state.notiLoader)
	const popupRef = useRef(null);

	useEffect(() => {
		if (notifications.length == 0) {
			setNotifications()
		}
		function handleClickOutside(event) {
						
			if (popupRef.current && !popupRef.current.contains(event.target) && !outRef.current.contains(event.target)) {
				onClose(); 
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

  return (
	  <motion.div ref={popupRef} className='home-title-notification-box' onClick={(e) => e.stopPropagation()}
	  	initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2,  }}>
		<div className="h-t-notification-inner">
			
			{!notiLoader ? (
				
				notifications.map((value, i) => {
					const [displayData, displayStyle] =  filterNotifications(value) 
					return (
						<motion.div className={"h-t-notifictns-each" + " " + displayStyle } key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
							transition={{ duration: 0.2, delay:i/20 }}>
						<div className="h-t-n-each-inner">
							<div className="h-t-n-content">
								{displayData}
							</div>
						</div>
						</motion.div>)
				})
			) : <>
				< l-newtons-cradle
					size="78"
					speed="1.2"
					color="white"
				></l-newtons-cradle >
			</> }
			  {notifications.length == 0 ? 
			  <><p style={{ textAlign: 'center' }}>No Notifications</p></> : 
			  <button className='h-t-n-clear-btn' onClick={() => setNotifications('CLEAR')}>Clear</button>}
			
			
		</div>
	</motion.div>
  )
}

export default NotificationBox