import React, { useEffect, useState } from 'react'
import { axiosApiInstance } from '../../lib/axios'
import Search from '../../assets/Search'
import { motion } from 'framer-motion'
import { toast } from 'sonner';

import './Friends.css'

	



function AddFriends() {
	
	const [friendInput, setFriend] = useState('')
	const [loader, setLoader] = useState(true)
	const [users, setUsers] = useState([])

	useEffect(() => {
		fetchRandomUsers();
	}, []);

	const fetchRandomUsers = async () => {
		try {
			setLoader(true);
			const response = await axiosApiInstance.get("/random-users");
			setUsers(response.data.users || []);
			setBtnState(Array(response.data.users.length).fill(false))
		} catch (error) {
			console.log("Error fetching random users:", error.message);
			toast.error("Random users error !! , "+error.message )
			setUsers([]);
			
		} finally {
			setLoader(false);
		}
	}

	const checkData = async (user) => {
		if (user == "") {
			return
		}
		try {

			const response = await axiosApiInstance.get(`add-friend/${user}`)
			if (!response.data.users) {
				setUsers([])
				return
			}
			setUsers(response.data.users)
			setBtnState(Array(response.data.users.length).fill(false))
			setLoader(false)
		} catch (err) {
			console.log(err.message);
			toast.error("Error finding users !! , "+ err.message)
		} finally {
			setLoader(false);
		}
	}

	useEffect(() => {
		setLoader(true);
		const delayDebounce = setTimeout(() => {
			if (friendInput.trim() !== "") {
				checkData(friendInput)
			} else {
				setLoader(false);
				return
			}
		}, 500)
		return () => clearTimeout(delayDebounce);
	}, [friendInput])

	const findFriend = (e) => {
		setUsers([])
		setFriend(e.target.value)
	}
	const [btnState, setBtnState] = useState([])
	const [requestsLoading, setRLoading] = useState(false)
	const sendRequest = async(id, key) => {
		if (!id) {
			return
		}
		setRLoading(true)

		setBtnState((prevStates) => {
			const newState = [...prevStates]
			newState[key] = true
			return newState
		})
		try{
			const response = await axiosApiInstance.get(`add-requests/${id}`)
			if (response.status == 204){
				toast.info("Already Friends",{duration:3000})
			}else toast.success("Friends Request Added", { duration: 3000 })
		}catch(err){
			console.log(err.message);
			toast.error("Error sending request !! , "+ err.message)
		}finally{
			setRLoading(false)
		}
		
	}
	return (
		<div className="friends-new friends-content">
			
			<div className="friends-space">
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }} className="friends-add-top">
					<div className="frineds-input">

						<input type="text" maxLength={90} value={friendInput} onChange={(e) => findFriend(e)} placeholder='Search for Friends across Server' />
						<Search />
						<p onClick={() => { setFriend(''); setUsers([]) }}>&times;</p>
					</div>
				</motion.div>
				<motion.hr initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }} />
				<div className="friends-list-friends">
					<motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .3 }}>
						Add New Friends

					</motion.p>
					<motion.div className="friends-list-inner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .3 }}>
						
						{loader && <motion.div className='friends-loader' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .5 }}>
							< l-tail-chase
								size="30"
								speed="1.2"
								color="white"
							></l-tail-chase >
						</motion.div>}
						{users.length != 0 ? (
							users.map((element, i) => (
								<motion.div className="friends-single" key={i} initial={{ opacity: 0,x:100, y: 70 }} animate={{ opacity: 1,x:0, y: 0 }} transition={{ duration: 0.2, delay: (i / 10)+.3 }} >
									<div className="each-friends">
										<div className="friend-image">
											<img src={element.profile_picture} alt="" />
										</div>
										<div className="friend-details">
											<div className="friend-title">
												{element.user_name}
											</div>
											<div className="friend-btn"> {requestsLoading && btnState[i] ?  < l-tail-chase
																		size = "30"
																		speed = "1.75"
																		color = "white"
																			></l-tail-chase > : (
													<button onClick={() => sendRequest(element._id, i)} disabled={btnState[i]} style={{ backgroundColor: btnState[i] ? "#00c461" : "" }}
													>    {btnState[i] ? "Requested" : "Request"}</button>
																			)}
												
											</div>
										</div>
									</div>
								</motion.div>
							))
						) : !loader && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}
							className=''>No User found</motion.p>}

					</motion.div>
				</div>
			</div>
		</div>
	)
}

export default AddFriends