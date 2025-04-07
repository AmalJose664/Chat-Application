import React, { useEffect, useState } from 'react'
import './ListFriends.css'
import { motion } from 'framer-motion'
import { axiosApiInstance } from '../../../lib/axios'
import { userDataStore } from '../../../store/userDataStore'


function ListFriends() {
	
	const [showFriends, setShowFriends] = useState(false)
  return (
	<div className="home-show-friends-container" >
		<div className="h-s-f-c-inner">
			  {!showFriends && <motion.div onClick={() => setShowFriends(true)} className='home-list-friends-toggle'
				
				initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
				  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"  viewBox="0 0 16 16">
					  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
				  </svg>
			</motion.div>}

			{showFriends && <ShowFriends setTab={setShowFriends} showFriends={showFriends}/>}

		</div>
	</div>
  )
}



function ShowFriends({ setTab, showFriends } ) {
	
	const setUserFriends = userDataStore( state => state.setUserFriends)
	const userFriends = userDataStore(state => state.userFriends)
	const setSelectUser = userDataStore(state => state.setSelectUser)
	const [loader, setLoader] = useState(false)

	const fetchFriends = async (signal)=>{
		try{
			setLoader(true)
			const response = await axiosApiInstance.get('my-friends/0/g', { signal })
			console.log(response.data);
			setUserFriends(response.data.users)
		}catch(err){
			console.log(err,err.message);
			
		}finally{
			setLoader(false)
		}	
		
	}
	useEffect(()=>{
		const controller = new AbortController();
		if (userFriends.length == 0){
			fetchFriends(controller.signal)
			
		}
		return () => controller.abort();
		
	},[showFriends])

	const setNewConv = (value)=>{
		setSelectUser({
			user_name: value.user_name,
			id: value._id,
			sqlId: value.sqlite_id,
			pic: value.profile_picture,
		})
	}
	return (
		<motion.div className="home-list-friends-box"  initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
			
			<div className="list-friends-box-in">
				<div className="f-l-h-back-btn" onClick={() => setTab(false)}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 16 16">
						<path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
					</svg> My Friends
				</div>
				<div className="list-f-b-i-inner">
					
					{loader && <motion.div style={{marginLeft:'35px'}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}>
						< l-newtons-cradle
							size="78"
							speed="1.2"
							color="black"
						></l-newtons-cradle >
					</motion.div>
						}

					{(userFriends.length != 0) ? (userFriends.map((value, i) => {
						return (
							<div key={i} className="list-friend-each" onClick={()=>setNewConv(value)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{
								duration: 0.2, delay: (i / 10 + .2)
							}} >
								<div className="list-f-avatar">
									<img src={value.profile_picture} alt="" />
								</div>
								<div className="list-f-user-title">
									{value.user_name}
								</div>
							</div>
						)
					})) : !loader && <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, }}
						className=''>No Friends To Chat..... Try adding New Friends</motion.p>}
				</div>
			</div>
		</motion.div>
	)
}




export default ListFriends
