import React, { useEffect, useRef, useState } from 'react'
import { axiosApiInstance } from '../../../../lib/axios'
import { motion } from 'framer-motion'
import { userDataStore } from '../../../../store/userDataStore';
import DashBoardICon from '../../../../assets/DashBoardICon';
import { toast } from 'sonner';

const  GetUser = React.memo(({closeFunct, status=false, group=false, id,isMe= false}) =>{
	const selectedUser = userDataStore(state => state.selectedUser);
	const [data, setData] = useState({})
	const detailRef = useRef(null)
	const getData = async()=>{
		try{
			if(group){
				const response = await axiosApiInstance.get(`get-user/${id}`)
				setData(response.data.user)
				return
			}
			const response = await axiosApiInstance.get(`get-user/${selectedUser.id}`)

			setData(response.data.user)
			
		}catch(err){
			console.log(err,err.message);
			toast.error("Error finding user data !! , "+err.message)
		}
	}
	const formatDate = (date)=>{
		const formatedDate = new Date(date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		return formatedDate
	}
	const sendRequest = async (id) => {
		
		if (!id && !group) {
			id = selectedUser.id
		}else{
			return
		}
		
		try {
			const response = await axiosApiInstance.get(`add-requests/${id}`)
			if (response.status == 204) {
				toast.info("Already Friends", { duration: 3000 })
			}else if(response.status == 200){
				toast.info("Friend Request Added", { duration: 3000 })
			}
		} catch (err) {
			toast.error("Error sending request !! , "+err.message)
			console.log(err.message);
		}

	}
	useEffect(()=>{
		getData()
		function handleClickOutside(event) {

			if (detailRef.current && !detailRef.current.contains(event.target)) {
				closeFunct();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			setData({})
			closeFunct()
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [selectedUser])

  return (
	  <div className={group ? "select-user-title-get-friend-details in-group" : "select-user-title-get-friend-details"} ref={detailRef}>
		
		  <motion.div className="s-u-t-g-f-d-inner" initial={{ opacity: 0, y: -20, scale: .5 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: .5 }}
			transition={{ duration: .1, ease:'backOut'}}>
			  <div className="s-u-t-g-f-d-close-btn" onClick={closeFunct}>&times;
				
			  </div>
			{!!data['email'] ?
			 <motion.div className="s-u-t-g-f-d-content" initial={{ opacity: 0, y: -20,  }} animate={{ opacity: 1, y: 0,  }} 
			transition={{ duration: .3, ease:'easeIn'}}>
				<div className="s-u-t-g-picture">
					<img src={data.profile_picture} alt="User Image" />
					{!isMe && <div onClick={()=>sendRequest(id)}>
						<DashBoardICon type='add' color='white'/>
					</div>}
				</div>
				<div className="s-u-t-g-details">
					<table>
						<tbody>
							<tr> 
								<td>{data.user_name}</td>
							</tr>
							<tr> 
								  <td>{data.email}</td>
							</tr>
							<tr>
								  <td>Joined on {formatDate(data.created_at)}</td>
							</tr>
							<tr>
								  <td>{status ? "Online" : "Seen Recently.."} </td>
							</tr>
						</tbody>
					</table>
				</div>
			</motion.div> : <p style={{textAlign:'center'}}>No data Found</p>}

		</motion.div>
	</div>
  )
})

export default GetUser
