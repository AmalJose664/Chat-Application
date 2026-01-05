import React, { useState } from "react"
import "./LoginComp.css"
import "/32947939_491362538070.jpg"
import { EyeFill, EyeIcon } from "../../assets/eye.jsx"
import Dybtn from "../../assets/Dybtn.jsx"
import Logo from "../../assets/Logo.jsx"
import { useAuthStore } from "../../store/useAuthStore.js"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { APP_Name } from "../../lib/chatUtilities.js"

function LoginComp() {
	const { login } = useAuthStore()
	const [passShow, setPassShow] = useState(false)
	const [formData, setForm] = useState({
		email: "",
		password: "",
	})
	const handleSubmit = async (e) => {
		e.preventDefault()
		await login(formData)
	}

	return (
		<div className="login-component">
			<div className="content">
				<div className="text">
					<h1>
						{APP_Name} <Logo size={30} />{" "}
					</h1>
				</div>
				<div className="power-text">
					<h1>
						By {APP_Name}
						<Logo size={30} />
					</h1>
				</div>
				<motion.div
					className="left"
					style={{ backgroundImage: "url('/32947939_491362538070.jpg')", backgroundPosition: "center", backgroundSize: "cover" }}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					<div className="grid">
						<GridView />
					</div>
				</motion.div>
				<motion.div className="right-part" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.5 }}>
					<motion.div className="right lines" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 1 }}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<h1>Log In</h1>

						<div className="form-content">
							<form onSubmit={handleSubmit}>
								<div className="input">
									<motion.input
										required
										type="email"
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, delay: 1.2 }}
										value={formData.email}
										onChange={(e) => setForm({ ...formData, email: e.target.value })}
									/>
									<label htmlFor="password">Email</label>
								</div>
								<div className="input">
									<motion.input
										required
										type={passShow ? "text" : "password"}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.2, delay: 1.2 }}
										value={formData.password}
										onChange={(e) => setForm({ ...formData, password: e.target.value })}
									/>
									<label htmlFor="">Password</label>
									<span type="button" onClick={() => setPassShow(!passShow)}>
										{" "}
										{passShow ? <EyeFill size={20} color="white" /> : <EyeIcon size={20} color="black" />}{" "}
									</span>
								</div>
								<motion.div
									className="input"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2, delay: 1.3 }}
								>
									<Dybtn text="sign in" />
								</motion.div>
							</form>
						</div>
						<Link to="/create" className="to-login">
							<p className="to-login">Create new chat account</p>
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
export default LoginComp

function GridView() {
	const boxes = Array.from({ length: 40 })
	return (
		<motion.div className="grid-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.4 }}>
			{boxes.map((_, index) => {
				if (index == 17) {
					return (
						<div key={index} className="box b-content">
							<div className="inner-box">
								<h3>Share Your Smile</h3>
								<svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M4 16V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V13C20 14.1 19.1 15 17 15H8L4 16"
										stroke="#fff"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>

									<circle cx="9" cy="9" r="1.2" fill="#fff" />
									<circle cx="12" cy="9" r="1.2" fill="#fff" />
									<circle cx="15" cy="9" r="1.2" fill="#fff" />
								</svg>
							</div>
						</div>
					)
				}
				if (index == 22) {
					return (
						<div key={index} className="box b-content">
							<div className="inner-box">
								<h3>Your words, your vibe, your community!</h3>
								<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#fff" viewBox="0 0 16 16">
									<path d="M6 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m4.5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
									<path d="M8 0a7.96 7.96 0 0 0-4.075 1.114q-.245.102-.437.28A8 8 0 1 0 8 0m3.25 14.201a1.5 1.5 0 0 0-2.13.71A7 7 0 0 1 8 15a6.97 6.97 0 0 1-3.845-1.15 1.5 1.5 0 1 0-2.005-2.005A6.97 6.97 0 0 1 1 8c0-1.953.8-3.719 2.09-4.989a1.5 1.5 0 1 0 2.469-1.574A7 7 0 0 1 8 1c1.42 0 2.742.423 3.845 1.15a1.5 1.5 0 1 0 2.005 2.005A6.97 6.97 0 0 1 15 8c0 .596-.074 1.174-.214 1.727a1.5 1.5 0 1 0-1.025 2.25 7 7 0 0 1-2.51 2.224Z" />
								</svg>
							</div>
						</div>
					)
				}
				if (index == 8) {
					return (
						<div key={index} className="box b-content">
							<div className="inner-box">
								<h3>Find new friends, share your world!</h3>
								<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#fff" className="bi bi-person-arms-up" viewBox="0 0 16 16">
									<path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
									<path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
								</svg>
							</div>
						</div>
					)
				}
				return <div key={index} className="box"></div>
			})}
		</motion.div>
	)
}
