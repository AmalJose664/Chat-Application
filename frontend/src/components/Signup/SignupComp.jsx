import React, { useState } from 'react'
import './SignupComp.css'
import { useAuthStore } from '../../store/useAuthStore'
import Dybtn from '../../assets/Dybtn.jsx'
import { EyeFill, EyeIcon } from '../../assets/eye.jsx'
import { Flip, ToastContainer, toast } from 'react-toastify';
import Logo from '../../assets/Logo.jsx'
import SignupImage from '../../assets/SignupImage.jsx'
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'
import { APP_Name } from '../../lib/chatUtilities.js'


function SignupComp() {
	
	const { createUser,  } = useAuthStore()
	const [passShow, setPassShow] = useState(false)
	const [formData, setForm] = useState({
		username:'telmey',
		email: 'amal446446@gmail.com',
		password: '123456',
	})

	const validateForm = () => {
		
		let toastSettings = {
			style: {
				background: "#000",
				color: "#fff"
			},
		}
		if (!formData.username.trim()) return toast.error("Full name is required", toastSettings);
		if (!formData.email.trim()) return toast.error("Email is required",  toastSettings);
		if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format",  toastSettings);
		if (!formData.password) return toast.error("Password is required",  toastSettings);
		if (formData.password.length < 6) return toast.error("Password must be at least 6 characters" , toastSettings);

		return true;
	};
	const handleSubmit = async (e) => {
		e.preventDefault()
		const success = validateForm();

		if (success === true){
			createUser(formData)
			console.log('finished');
		}
		return console.log('Validation failed');
		
	}
  return (
	  <div className='signup-component' ><div className="sign-text">
		  
		  <h2 >Welcome to {APP_Name} <Logo /></h2>
	  </div>
		  <div className="sign-power-text">
			  <h1>By {APP_Name }<Logo size={30} /></h1>
		  </div>
		<div className='singup-logo'><Logo size={140} color='black' /></div>
		<motion.div className="back" initial={{ opacity: 0, y: 220 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: .5 }}>
			  
			
			<div className="inner-signup lines">
				  <span></span>
				  <span></span>
				  <span></span>
				  <span></span>
				<div className="image-svg">
					<SignupImage />
				</div>
			
			</div>
			
		</motion.div>
		  
		  <motion.div className="sign-right-container-create-page" initial={{ opacity: 0, y: 140 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: .62 }}>
			  <div className="sign-right sign-lines" >
				  <span></span>
				  <span></span>
				  <span></span>
				  <span></span>
				  <h1>Sign Up</h1>

				  <motion.div className="form-content" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .8 }}>
					  < form onSubmit={handleSubmit} >
						  <div className="input">
							  <motion.input initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: .8 }}
								  value={formData.email}
								  placeholder=''
								  onChange={(e) => setForm({ ...formData, email: e.target.value })} />
							  <label htmlFor="password">
								  Email
							  </label>
						  </div>
						  <div className="input">
							  <motion.input type="text"  maxLength={25} initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1 }}
								  value={formData.username}
								  placeholder=''
								  onChange={(e) => setForm({ ...formData, username: e.target.value })} />
							  <label htmlFor="username">
								  User Name
							  </label>
						  </div>
						  <div className="input">
							  <motion.input type={passShow ? 'text' : 'password'}
								value={formData.password} initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1.2 }}
								minLength={6} 
								placeholder=''
								onChange={(e) => setForm({ ...formData, password: e.target.value })} />
							  <label htmlFor="">Password</label>
							  <span type="button" onClick={() => setPassShow(!passShow)}> {passShow ? <EyeFill size={20} color="white" /> : <EyeIcon size={20} color="black" />}   </span>
						  </div>
						  <motion.div className="input" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1.4 }}>
							  <Dybtn text='create' color='#02a2dc' />

						  </motion.div>
					  </form >
				  </motion.div><Link to="/login" className="to-login"><p className='to-login' >Log In to Existing Account</p></Link>
			  </div>
		</motion.div>
	</div>
  )
}

export default SignupComp
