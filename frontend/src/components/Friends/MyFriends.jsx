import React, { useEffect, useState } from 'react'
import './Friends.css'
import { motion } from 'framer-motion'
import { axiosApiInstance } from '../../lib/axios'
import { userDataStore } from '../../store/userDataStore'


function MyFriends() {

	
	const { setUserFriends, userFriends } = userDataStore()
	const [loader, setLoader] = useState(false)
	
	const fecthUsers = async()=>{
		setLoader(true)
		try {
			const response = await axiosApiInstance.get('my-friends/0/g')
			console.log(response.data);
			setUserFriends(response.data.users)
		}
		catch(err){
			console.log(err.message, err);
		}finally{
			setLoader(false)
		}
		
		
	}

	useEffect(()=>{
		if (userFriends.length == 0) {
			fecthUsers()
		}
	},[])
	
	const removeFriend = async(id, key )=>{
		try{
			const response = await axiosApiInstance.get(`my-friends/${id}/REMOVE`)
			console.log(response);
			if (response.status == 200) {
				
				setUserFriends(userFriends.filter((_,i)=> i !==key))
			}
		}catch(err){
			console.log(err, err.message);
			
		}
		
	}
	
	return (
		<div className="friends-user friends-content">
			<div className="friends-space">
				<motion.hr initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }} />
				<motion.div className="friends-added" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .3 }}>
					<p style={{display:'inline'}}>My Friends</p> 
					<span style={{float:'right', cursor:'pointer'}} onClick={fecthUsers}>  
						Refresh Friends	
					</span>
					<div className="friends-list-inner-modified">
						{loader && <motion.div className='friends-loader my-friends' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2,  }}>
							< l-newtons-cradle
								size="78"
								speed="1.2"
								color="white"
							></l-newtons-cradle >
						</motion.div>}

						{userFriends.length != 0 ? (
							userFriends.map((value, i) => {
								return (
									<motion.div className="friends-added-each" key={i} initial={{ opacity: 0,x:40, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: (i / 10+.2) }}>
										<div className="friends-each-inner">
											<div className="friend-added-section1">
												<div className="friend-image">
													<img src={value.profile_picture} alt="" />
												</div>
												<div className="friend-title">
													{value.user_name}
												</div>
											</div>
											<div className="friend-added-section2">
												<div className="friend-message-btn friend-btn">
													<button>Message</button>
												</div>
												<div className="friend-view  friend-btn">
													<button>View Details</button>
												</div>
												<div className="friend-remove  friend-btn">
													<button onClick={() => removeFriend(value._id, i)}>Remove Friend</button>
												</div>
											</div>
										</div>
									</motion.div>
								)
							})
						) : !loader && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}
							className=''>No Friends Yet.</motion.p> }


					</div>
				</motion.div>
			</div>
		</div>
	)
}


export default MyFriends
