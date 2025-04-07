import React, { useState, useRef, useEffect, } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore';
import Pencil from '../../assets/Pencil';
import Dybtn from '../../assets/Dybtn'


function EditProfile(  {closeTab} ) {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
	const fileInputRef = useRef(null);
	const [image, setImage] = useState(authUser.db_user.profile_picture)

	const [formData, setForm] = useState({
		username: authUser.db_user.user_name,
		email: authUser.db_user.email,
		file: null,
		publicId :null
	})
	
	
	const handleSubmit = async(e)=>{
		e.preventDefault()
		await updateProfile(formData)
		closeTab(false)
	}
	const handleImageUpload = (e) => {
		const file = e.target.files[0]
		
		if(!file){return}
		setForm(prevForm => ({
			...prevForm,
			file: file,
		}));
		fileInputRef.current.value = "";
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = async ()=>{
			const base64Image = reader.result;
			setImage(base64Image)
		}
	};
	useEffect(()=>{
		return ()=>{
			if (formData.file) setForm(null)
		}
	},[])
	
  return (
	<motion.div className="profile-edit-tab"  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}>
		<span onClick={() => closeTab(false)}>&times;</span>
		<div className="profile-edit-tab-inner">
			<form className="profile-edit-tab-content" onSubmit={handleSubmit}>
				
				<div className="input">
					<img src={image} alt=""/>
					<input ref={fileInputRef} type="file" className='hidden-input-profile-page'   accept='image/*' disabled={isUpdatingProfile} onChange={handleImageUpload} />
					
					  <div className="picture-select-btn" onClick={() => { fileInputRef.current?.click() }}>
						<Pencil color='white' type='camera'/>
					</div>
					
				</div>
				<div className="input">
					<motion.input required type="email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}
						value={formData.email}
						onChange={(e) => setForm({ ...formData, email: e.target.value })} />
					<label className='profile-page-edit-label' htmlFor="password">
						Email
					</label>
				</div>
				<div className="input">
					<motion.input required  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}
						value={formData.username}
						onChange={(e) => setForm({ ...formData, username: e.target.value })} />
					<label className='profile-page-edit-label' htmlFor="">User Name</label>
				</div>
				<motion.div className="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .4 }}>
					<Dybtn text='save' color='#32a9f7'/>
				</motion.div>
			</form>
		  </div>
	</motion.div>
  )
}

export default EditProfile
