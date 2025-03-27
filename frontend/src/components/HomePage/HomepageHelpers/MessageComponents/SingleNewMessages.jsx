import React, { useState } from "react"
import { useAuthStore } from "../../../../store/useAuthStore"
import { motion } from "framer-motion"
import { getTime } from "../../../../lib/timefilter"
import ReadReceipts from "../../../../assets/ReadReceipts"
import DashBoardICon from "../../../../assets/DashBoardICon"
import { SmallBox } from "./SingleMessage"
import GetMessageDetails from "./GetMessageDetails"


export const SingleNewMessages = React.memo(({ message, i }) => {

	const [smallBoxActive, setSmallBoxActive] = useState(false)
	const [detailBox, setDetailBox] = useState(false)
	const { authUser } = useAuthStore()
	const receive = message.s == authUser.db_user._id
	return (
		<motion.div key={i} className={message.r == authUser.db_user._id ? "message__h type-receive" : "message__h type-sent"}
			initial={{ opacity: 0, x: receive ? 28 : -28 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: message.c_id ? .3 : .1, delay: message.c_id ? i / 20 : 0 }}
		>
			<div className={detailBox ? "message__wrapper hide" : "message__wrapper"}>
				<div className="message__in">
					<div className="message__content">
						{message.c}
					</div>
					<span className="message__time">
						{getTime(message.t)}
					</span>
					{message.s == authUser.db_user._id ? <span className='message__status'>
						<ReadReceipts status={message.sa} />
					</span> : ""}

				</div>
				<div className="message__options">
					<div onClick={() => setSmallBoxActive(!smallBoxActive)} onMouseLeave={() => setSmallBoxActive(false)} className="m__option" >
						<DashBoardICon type='dots' color='grey' />
						{smallBoxActive && <SmallBox m_id={message._id} message={message.c} time={message.t} togleDetailBox={setDetailBox} side={message.r == authUser.db_user._id} />}
					</div>
				</div>
			</div>{detailBox && <GetMessageDetails togleDetailBox={setDetailBox} />}
		</motion.div>
	)
})

