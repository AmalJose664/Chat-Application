import React, {  useState } from 'react'
import './ProfileComp.css'
import '/dark-abstract-3840x2160-contemporary-design-sleek-lines-26426343.jpg'
import {  motion } from 'framer-motion'
import {axiosSpecialAuthInstance} from '../../lib/axios'
import {useAuthStore} from '../../store/useAuthStore'
import Pencil from '../../assets/Pencil'
import EditProfile from './EditProfile'
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom'
import {lastMessage} from '../../lib/lastMessageFilter'
import { userDataStore } from '../../store/userDataStore'
import { useSpecialStore } from '../../store/specialStore'
import { useGroupConnectStore } from '../../store/useGroupConnect'



function ProfileComp() {
	
	const [getData,setGetData] = useState(false)
	const [getingData,setGetingData] = useState(false)
	const  [userData, setUserData] = useState(null)
	const [edit,editMode] = useState(false)
	const authUser = useAuthStore(state => state.authUser)

	const navigate = useNavigate()
	
	const fetchData = async()=>{
		try{
			setGetingData(true)
			const response = await axiosSpecialAuthInstance.get('data/')
			setUserData({ my_id: response.data.user,  friend_data: response.data.friend_data, message_data: response.data.message_data  })
			setGetData(true)
		}catch(err){
			console.log(err, err.message);
			toast.error(err.response.data ,""+ err.message);
		}finally{
			setGetingData(false)

		}
	}
	

  return (
	<div className='profile-component'>
		<div className="profile-component-container">
			<div className="prfile-inner-box">
				<motion.div className="profile-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay:.4}}>
					  {edit ? <EditProfile closeTab={editMode} /> : <motion.div className={edit ? "content-inner-profile close" : "content-inner-profile"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .8 }}>

						  <div className="profile-left-side">
							  <div className="profile-left-container">
								  <div className="profile-edit-btn" onClick={() => editMode(true)}>
									  <Pencil color='white' />
								  </div>
								  <motion.div className="image-box-profile" drag
									  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}>
									  <img draggable={false} src={authUser.db_user.profile_picture} alt="" />
								  </motion.div>
								  <motion.div className="title-box-profile" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1 }}>
									  <h1>{authUser.db_user.user_name}</h1>
								  </motion.div>
								  <motion.hr initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1.18 }} />
								  <motion.div className="details-box-profile" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1.3 }}>
									  <h1>{authUser.db_user.email}</h1>
								  </motion.div>
							  </div>

						  </div>
						  <motion.div className="profile-line" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1.4 }}>

						  </motion.div>
						  <div className="profile-right-side">
							  <div className="profile-right-container">
								  <div className="profile-user-statics">
									  <div className="profile-s-title">
										  <h1 >Statictiscs</h1>
									  </div>

									  {!getData && <div className="profile-fetch-additional-data">
										  {!getingData ? <button className='data-btn' onClick={fetchData}>
											  Get More Data on Me
										  </button> :
											  <l-tail-chase
												  size="40"
												  speed="1.95"
												  color="white"
											  ></l-tail-chase>
										  }


									  </div>}

									  {userData && <table className='data-table-profile'>
										  <tbody>
											  <tr>
												  <td>Total Messages Sent:</td>
												  <td>{userData.message_data.sent_count}</td>
											  </tr>
											  <tr>
												  <td>Total Messages Received:</td>
												  <td>{userData.message_data.receive_count}</td>
											  </tr>
											  <tr>
												  <td>Conversations:</td>
												  <td>{userData.message_data.total_conversations}</td>
											  </tr>
											  <tr>
												  <td>Unread Messages:</td>
												  <td>{userData.message_data.unread_count}</td>
											  </tr>
											  <tr>
												  <td>Last Message:</td>
												  <td>{lastMessage(userData.message_data.last_message)}</td>
											  </tr>
											  <tr>
												  <td>Friends:</td>
												  <td>{userData.friend_data.friends_count}</td>
											  </tr>
											  <tr>
												  <td>Pending Friend Request:</td>
												  <td>{userData.friend_data.pending_f_requests}</td>
											  </tr>
										  </tbody>
									  </table>}



								  </div>
							  </div>
						  </div>
					  </motion.div>}
				</motion.div>
			</div>
		  </div>
		  <div onClick={() => navigate(-1)} className="profile-page-go-back-btn">
			  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
				  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
			  </svg>
		  </div>
		  <Link>
			  <Logout />
		  </Link>
	</div>
  )
}

function Logout(){
	const setConversationsStore = userDataStore(state => state.setConversationsStore)
	const setSelectUser = userDataStore.getState().setSelectUser;
	const clearNotification = useSpecialStore(state => state.clearNotification)
	const deleteSocketGroup = useGroupConnectStore(state => state.deleteSocket)
	
	
	const logout = useAuthStore(state => state.logout)
	const logoutUser = () => {
		setConversationsStore([])
		setSelectUser({})
		clearNotification()
		deleteSocketGroup()
		logout()
	}
	return (
		<div className="profile-page-logout-user">
			<button onClick={logoutUser}>LogOut</button>
		</div>
	)
}



export default ProfileComp

