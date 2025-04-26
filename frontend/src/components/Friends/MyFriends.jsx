import React, { useEffect, useState } from 'react'
import './Friends.css'
import { motion } from 'framer-motion'
import { axiosApiInstance } from '../../lib/axios'
import { userDataStore } from '../../store/userDataStore'
import { lineWobble } from 'ldrs'
import GetUser from '../HomePage/HomepageHelpers/HomeUtils/GetUser'
lineWobble.register()




function MyFriends() {

	
	const userFriends = userDataStore(state => state.userFriends)
	const setUserFriends = userDataStore(state => state.setUserFriends)

	const [loader, setLoader] = useState(false)
	const [cursor, setCursor] = useState('')
	const [showUser, setShowUser] = useState('')
	const [showLoadMore, setLoadMore] = useState(false)

	
	const fecthUsers = async()=>{
		setLoader(true)
		try {
			if(!cursor) setCursor('000000000')
			const response = await axiosApiInstance.get('my-friends/0/g?cursor=' + cursor)
			console.log(response.data);
			if(cursor){
				setCursor(response.data.next_cursor)
				return setUserFriends([...userFriends, ...response.data.users])
			}
			setUserFriends(response.data.users)
			setLoadMore(response.data.is_last)
			setCursor(response.data.next_cursor)
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
					<p style={{display:'inline'}}>My Friends
						
						</p> 
					<span style={{float:'right', cursor:'pointer'}} onClick={()=>{setCursor('');fecthUsers()}}>  
						Refresh Friends	
					</span>
					<div className="friends-list-inner-modified">
						{loader && <motion.div className='friends-loader ' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
							< l-line-wobble
								size="500"
								stroke="2"
								bg-opacity="0.1"
								speed="1.75"
								color="white"
							></l-line-wobble >
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
												
												<div className="friend-view  friend-btn">
													<button onClick={()=>setShowUser(value._id)}>View Details</button>
													{showUser && (value._id == showUser && <GetUser group={true} id={showUser} closeFunct={() => setShowUser('')} />)}
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
						{(userFriends.length != 0 && !showLoadMore) && 
							<button className='friend-load-more' onClick={fecthUsers}>Load More</button>
							}


					</div>
				</motion.div>
			</div>
		</div>
	)
}


export default MyFriends
