import React, { useState, useRef, useEffect, } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore';
import Pencil from '../../assets/Pencil';
import Dybtn from '../../assets/Dybtn'
import { toast } from 'sonner';


function EditProfile(  {closeTab} ) {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
	const fileInputRef = useRef(null);
	const [image, setImage] = useState(authUser.db_user.profile_picture)

	const [formData, setForm] = useState({
		username: authUser.db_user.user_name,
		email: authUser.db_user.email,

		file: null,
		password :''
	})
	const [passTab,setPassTab] = useState(false)
	
	
	const handleSubmit = async(e)=>{
		e.preventDefault()
		if(formData.email && formData.username){
			setPassTab(true)
		}else{
			toast.error(" !! ")
		}

	}
	const handleImageUpload = (e) => {
		const file = e.target.files[0]
		
		if(!file){return}
		if (file.size > 20 * 1024 * 1024) return toast.error("Image size must be less than 20 MB.");
		if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
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
	const update= async()=>{
		console.log(formData);
		
		if(!formData.password || !formData.email || !formData.username) return toast.info("Please Enter Required details")
		await updateProfile(formData)
		setPassTab(false)
		closeTab(false)
	}
	
  return (
	<motion.div className="profile-edit-tab"  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}>
		<span onClick={() => closeTab(false)}>&times;</span>
		<div className="profile-edit-tab-inner">
			<form className="profile-edit-tab-content">
				
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
					<label className='profile-page-edit-label' htmlFor="">
						Email
					</label>
				</div>
				<div className="input">
					<motion.input required  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}
						value={formData.username}
						onChange={(e) => setForm({ ...formData, username: e.target.value.replace('__',"_") })} />
					<label className='profile-page-edit-label' htmlFor="">User Name</label>
				</div>
				<motion.div  className="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .4 }}
					  onClick={handleSubmit}
					>
					<Dybtn text='update' color='#32a9f7'/>
				</motion.div>
			</form>
			{passTab && <EnterPassword 
				triggerFunction={update}
				closeTab={() => setPassTab(false)} setForm={(value)=>setForm({...formData, password:value})} password={formData.password}/>}
		</div>
	</motion.div>
  )
}


function EnterPassword({closeTab, setForm, triggerFunction, password}){
	//const updateProfile = useAuthStore(state => state.updateProfile)
	const tabRef = useRef(null)
	useEffect(() => {
		function handleClickOutside(event) {
			if (tabRef.current && !tabRef.current.contains(event.target)) {
				closeTab()
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [])
	return (
		<motion.div ref={tabRef} className='profile-page-passtab' 
			initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}
			>
			<div className="profile-page-passtab-inner">
				<p>Enter Current Password to Change User Data</p>
				<div className="input">
					<motion.input required initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .2 }}
						value={password}
						onChange={(e) => setForm(e.target.value)} />
					<label className='profile-page-edit-label' htmlFor="">Password</label>
				</div>
				<button className='profile-password-btn' onClick={triggerFunction}>
					submit
				</button>
			</div>
		</motion.div>
	)
}

export default EditProfile
