import React, { useEffect, useRef, useState } from 'react'
import './SettingComp.css'
import ReadReceipts from '../../assets/ReadReceipts'
import Logo from '../../assets/Logo'
import { APP_Name, bgImages, colors, convertStringToCss, getContrastColor, loadPreferences } from '../../lib/chatUtilities'
import { toast } from 'sonner';
import { motion,AnimatePresence } from 'framer-motion'
import {axiosApiInstance,ip,proto} from '../../lib/axios'
import { useAuthStore } from '../../store/useAuthStore';

import { Link, useNavigate } from 'react-router-dom'

function SettingComp() {
	
	const [customBackground, setCustomBackground] = useState('')
	const [fontSize, setFontSize] = useState(16)
	const [chatColor, setChatColor] = useState({r:'',s:''})
	const [tickColor, setTickColor] = useState({ r: '', d: '' })
	const [enterSend, setEnterSend] = useState(true)
	const [messageCrnr, setMessageCrnr] = useState(10)
	const [mesgTrans, setMesgTrans] = useState(true)

	const [picSelect, setPicSelect] = useState(false)
	const [colSelectChat, setColSelectChat] = useState(false)
	const [colSelectTick, setColSelectTick] = useState(false)

	const authUser = useAuthStore(state => state.authUser)
	const navigate = useNavigate()
	
	const saveData = ()=>{
		const preference = {
			customBackground,
			fontSize,
			chatColor,
			tickColor,
			enterSend,
			messageCrnr,
			mesgTrans,
		}
		localStorage.setItem('ChatUIPrefernc', JSON.stringify(preference))
		toast.success("Preferences Set !!")
	}
	const reset = ()=>{
		localStorage.removeItem('ChatUIPrefernc')
		setCustomBackground('')
		setFontSize(16)
		setChatColor({ r: '', s: '' })
		setTickColor({ r: '', d: '' })
		setEnterSend(true)
		setMessageCrnr(10)
		setMesgTrans(true)
		toast.success("Preferences Changed !!")
	}
	useEffect(()=>{
		const parsedPrefrnc = loadPreferences()
		if (parsedPrefrnc.customBackground){
			try{
				setCustomBackground(parsedPrefrnc.customBackground)
				setFontSize(parsedPrefrnc.fontSize)
				setChatColor(parsedPrefrnc.chatColor)
				setTickColor(parsedPrefrnc.tickColor)
				setEnterSend(parsedPrefrnc.enterSend)
				setMessageCrnr(parsedPrefrnc.messageCrnr)
				setMesgTrans(parsedPrefrnc.mesgTrans)
			}catch(err){
				console.log(err);
				toast.error("Error loading preferences !! "+err.message)
			}
			
		}
	},[])
	const test = ()=>{
		
		// const myPromise = new Promise((resolve,reject) => {
		// 	setTimeout(() => {
		// 		resolve({ name: 'My toast' });
		// 	}, 3000);
		// });
		try {
			const myPromise = axiosApiInstance.get('default_api/test-api', { baseURL: `${proto}://${ip}` }).catch((err)=>{
				console.log(err)
			})


			toast.promise(myPromise, {
				loading: 'Loading...',
				success: (axiosData) => {
					console.log(axiosData)
					
					return `Status=> ${axiosData.data.status_w} || User=> ${axiosData.data.user} || Status_code=> ${axiosData.data.status}`;
				},
				error: 'Error => Server Connecting Error',
			});
		} catch (error) {
			console.log(error)
			toast.error('Error => Server Connecting Error !! '+error.message)
		}
		
	}
		
	
	
	return (
		<div className="setting-component" >
			
			<div className="setting-inner">
				<h1>Settings</h1>
				<div className="s-flex-container">
					<motion.div className="s-options" 
						initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
						>
						<div className="s-options-inner">{authUser && <p>{authUser.user.name}'s Settings</p>}

							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
									>
									<div className="s-option-title">
										Background
									</div>
									<div className="s-action-place">
										<button onClick={()=>setPicSelect(true)}>
											Select
										</button>
										<AnimatePresence>
											{picSelect && <BackgroundSelector setFunction={(bg) => setCustomBackground(bg)} closeTab={() => setPicSelect(false)} />}
										</AnimatePresence>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}
									>
									<div className="s-option-title">
										Font Size 
									</div>
									<div className="s-action-place">
										<input type="range" max={30} min={7} onChange={(e)=>setFontSize(e.target.value)} defaultValue={20}/>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1 }}
									>
									<div className="s-option-title">
										Chat Bubble Color
									</div>
									<div className="s-action-place">
										<button onClick={() => setColSelectChat(!colSelectChat)} style={{ background: `linear-gradient(to right, ${chatColor.s} 50%, ${chatColor.r} 50%)` }}>
											Select
										</button>
										<AnimatePresence>
											{colSelectChat && <ColorSelector selected={chatColor} closeTab={() => setColSelectChat(false)} setFunction={(c) => setChatColor(c)} />}
										</AnimatePresence>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.3 }}
									>
									<div className="s-option-title">
										Red Tick Color
									</div>
									<div className="s-action-place">
										<button onClick={() => setColSelectTick(!colSelectTick)} style={{ background: `linear-gradient(to right, ${tickColor.d} 50%, ${tickColor.r} 50%)` }}>
											Select
										</button>
										<AnimatePresence>
											{colSelectTick && <ColorSelector isReadValue={true} selected={tickColor} closeTab={() => setColSelectTick(false)} setFunction={(c) => setTickColor(c)} />}
										</AnimatePresence>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.5 }}
									>
									<div className="s-option-title">
										Message Corners
									</div>
									<div className="s-action-place">
										<input type="range" defaultValue={messageCrnr} min={0} max={40} onChange={(e)=>setMessageCrnr(e.target.value)}/>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.7 }}
									>
									<div className="s-option-title">
										Send with Enter
									</div>
									<div className="s-action-place">
										<div className="checkbox-wrapper-51">
											<input id="cbx-51" type="checkbox" checked={enterSend} onChange={()=>setEnterSend(!enterSend)}/>
											<label className="toggle" htmlFor="cbx-51">
												<span>
													<svg viewBox="0 0 10 10" height="10px" width="10px">
														<path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
													</svg>
												</span>
											</label>
										</div>
									</div>
								</motion.div>
							</div>
							<div className="s-each-options">
								<motion.div className="s-opton-each-content"
									initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.7 }}
								>
									<div className="s-option-title">
										Transparent Message Box
									</div>
									<div className="s-action-place">
										<div className="checkbox-wrapper-51">
											<input id="cbx-52" type="checkbox" checked={mesgTrans} onChange={() => setMesgTrans(!mesgTrans)} />
											<label className="toggle" htmlFor="cbx-52">
												<span>
													<svg viewBox="0 0 10 10" height="10px" width="10px">
														<path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
													</svg>
												</span>
											</label>
										</div>
									</div>
								</motion.div>
							</div>
							{(authUser && authUser.user.is_superuser) &&
								<div className="s-each-options">
									<motion.div className="s-opton-each-content"
										initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.7 }}
									>
										<Link to={import.meta.env.VITE_API_ADMIN_URL} target="_blank" className="s-option-title admin" >
											Manage app users (admin only)
										</Link>

									</motion.div>
								</div>
							}

						</div>
						<div className="s-save-settings">
							<motion.button onClick={saveData}
								initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.8 }}
								>
								Save Changes
							</motion.button>
							<motion.button onClick={reset}
								initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.9 }}
								>
								Reset Preferences
							</motion.button>

						</div>
						<motion.button onClick={test} className='server-test-btn'
							initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.9 }}
						>
							Test Server
						</motion.button>
					</motion.div>


					{/* chat demo  */}
					<motion.div className="s-chat-demo" 
						initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
						>
						<div className="s-selected-demo">
							<motion.div className="s-selected-demo-inner"
								initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}
								>
								<div className="s-demo-image">
									<Logo/>
								</div>
								<div className="s-demo-title">
									{APP_Name}
								</div>
							</motion.div>
						</div>
						
						{/* h-m div down changed to s-chat-deom-inner */}
						<div className="s-chat-demo-inner" style={{ ...convertStringToCss(customBackground) }}> 
							<div className="wrapper">
								<motion.div className="message__h type-sent" style={{ borderRadius: `${messageCrnr}px` }}
									initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.9 }}
									>
									<div className="message__wrapper" style={{ background: chatColor.r, borderRadius: `${messageCrnr}px` }}>
										<div className="message__in">
											<div className="message__content" style={{ color: getContrastColor(chatColor.r), fontSize: `${fontSize}px` }}>
												{APP_Name} is amazing... {fontSize}
											</div>
											<span className="message__time" style={{ color: getContrastColor(chatColor.r) }}>
												12.49 AM
											</span>
											<span className='message__status'>
												<ReadReceipts status={2} dColor={tickColor.d} rColor={tickColor.r} />
											</span>
										</div>
									</div>
								</motion.div>
								<motion.div className="message__h type-receive" style={{ borderRadius: `${messageCrnr}px` }}
									initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.9 }}
									>
									<div className="message__wrapper" style={{ background: chatColor.s, borderRadius: `${messageCrnr}px` }}>
										<div className="message__in">
											<div className="message__content" style={{ color: getContrastColor(chatColor.s), fontSize: `${fontSize}px` }}>
												Yah !! For Sure....
											</div>
											<span className="message__time" style={{ color: getContrastColor(chatColor.s) }}>
												12.49 AM
											</span>
											<span className='message__status'>
												<ReadReceipts status={2} dColor={tickColor.d} rColor={tickColor.r} />
											</span>
										</div>
									</div>
								</motion.div>
								<motion.div className="s-demo-type-interface"
									initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.2 }}
									>
									<div className={mesgTrans ? 's-demo-type-inner transparent' : 's-demo-type-inner'}>
										<div className="s-type-part" contentEditable='plaintext-only' suppressContentEditableWarning={true}>
											Type a Message !
										</div>
									</div>
								</motion.div>
							</div>
							
						</div>
					</motion.div>
				</div>
			</div>
			<div onClick={() => navigate(-1)} className="profile-page-go-back-btn go-back-btn-arraow">
				<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
					<path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
				</svg>
			</div>
			
		</div>
	)
}


export default SettingComp

function BackgroundSelector({closeTab, setFunction}){
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
		<motion.div  className='s-select-popup bg' ref={tabRef}
			initial={{ opacity: 0, y: -140, }} animate={{ opacity: 1, y: 0, }}
			transition={{ duration: .5, ease: 'backIn' }} exit={{ opacity: 0, y: -140 }}
		>
			<div className="-s-select-popup-inner">
				
				<div className="s-list-bgs-inner">
					{bgImages.map((image, i)=>{
						
						return (
							<div className="s-bg-images-each" key={i}>
								<div className="div-s-each-images-inner"
								>
									<div onClick={() => {
										setFunction(image);
										closeTab()
									}} style={{ ...convertStringToCss(image) }} className="s-image"></div>
								</div>
							</div>
						)

					})}
				
				</div>
			</div>
			<CustomBg setFunction={setFunction} closeTab={closeTab}/>
			 
		</motion.div>
	)
}
function CustomBg({setFunction, closeTab}){
	const [custmBg, setCustmBg] = useState('')

	
	return (
		<div className="s-select-custom">
			<input type="text" value={custmBg} onChange={(e) =>{

				if (e.target.value.length < 5 && e.nativeEvent.inputType != 'deleteContentBackward') return
				setCustmBg(e.target.value)
			} } 
			placeholder='Image Link' />
			
			{custmBg && <img src={custmBg} onLoad={(e) => { setFunction(`background::: url('${custmBg}')center/cover;`); closeTab() }
			}

				alt="Not a valid link" />}
			{/* setCustmBg({...custmBg, valid: true }) */}
		</div>
				
	)
}

function ColorSelector({ selected, setFunction, closeTab, isReadValue}){
	const tabRef = useRef(null)
	useEffect(()=>{
		function handleClickOutside(event){
			if (tabRef.current && !tabRef.current.contains(event.target)) {
				closeTab()
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	},[])
	
	
	return (
		<motion.div className='s-select-popup' ref={tabRef} 
			initial={{ opacity: 0, x: 140, }} animate={{ opacity: 1, x: -10, }}
			transition={{ duration: .5, ease: 'backIn' }} exit={{ opacity: 0, x: 140 }}
			>
			<div className="-s-select-popup-inner">
				<div className="s-select-colors">
					{colors.map((c,i )=>{
						return (
							<motion.div key={i} style={{ background: `linear-gradient(to right, ${c.s} 50%, ${c.r} 50%)` }} 
							onClick={()=>{
								setFunction(isReadValue ? { d: c.s, r: c.r }:c);
							}}
								initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: i/20 }}
								className={selected.r == c.r && selected.s == c.s ? "s-show-colors selected" :"s-show-colors"}>
								
							</motion.div>
						)
						
					})}
					
				</div>
			</div>

		</motion.div>
	)
}



