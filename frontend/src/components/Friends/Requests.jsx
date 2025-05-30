import React, { useEffect, useState } from 'react'
import './Friends.css'
import { motion } from 'framer-motion'
import { axiosApiInstance } from '../../lib/axios'
import { toast } from 'sonner'


function Requests() {



	const [users, setUsers] = useState([])
	const [loader, setLoader] = useState(true)
	const loadRequests = async () => {
		try {

			const response = await axiosApiInstance.get('my-requests/')

			setUsers(response.data.users)
		} catch (err) {
			console.log(err.message);
			toast.error("Error loading Friend requests " + err.message)
		} finally {
			setLoader(false)
		}
	}
	useEffect(() => {
		loadRequests()
	},[])

	const sendResponse = async (id, action, key ) => {
		if (!id) {
			return
		}
		try {
			const response = await axiosApiInstance.get(`handle-requests/${id}/${action}`)

			if(response.status == 200){
				setUsers((preState) => {
					return preState.filter((_, i) => i !== key)
				})
			}
		} catch (err) {
			console.log(err);
			toast.error("Error on operation !!" + err.message)

		}
	}

	return (
		<div className="friend-requests">
			<hr />
			<motion.div className="friends-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
				<p>My Friend Requests</p>
				<div className="friend-request-all friends-list-inner">
					{loader && <motion.div className='friends-loader' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .1 }}>
						< l-tail-chase
							size="30"
							speed="1.8"
							color="white"
						></l-tail-chase >
					</motion.div>}
					{users.length != 0 ? (
						
							users.map((value, i) => (
								<motion.div className="friend-request-each" key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i / 10 }}>
									<div className="request-inner">
										<div className="friend-image-title">
											<div className="friend-image">
												<img src={value.profile_picture} alt="" />
											</div>
											<div className="friend-title">
												{value.user_name}
											</div>
										</div>
										<div className="request-data">
											<div className="request-btn friend-btn">
												<button onClick={() => sendResponse(value._id, 'CONFIRM',i)}>Confirm</button>
												<button onClick={() => sendResponse(value._id, 'DECLINE',i)} >Decline</button>
											</div>
										</div>
									</div>
								</motion.div>

							))
					) : !loader && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}
						className=''>No Friend Requests Yet</motion.p>}
				
					
				</div>
			</motion.div>
		</div>
	)
}

export default Requests
