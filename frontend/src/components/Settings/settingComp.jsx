import React, { useEffect, useRef, useState } from 'react'
import './SettingComp.css'
import ReadReceipts from '../../assets/ReadReceipts'
import Logo from '../../assets/Logo'
import { bgImages, colors, convertStringToCss, getContrastColor, loadPreferences } from '../../lib/chatUtilities'
import { toast,ToastContainer,Flip } from 'react-toastify'

import { Link } from 'react-router-dom'

function SettingComp() {
	
	const [customBackground, setCustomBackground] = useState('')
	const [fontSize, setFontSize] = useState(16)
	const [chatColor, setChatColor] = useState({r:'',s:''})
	const [tickColor, setTickColor] = useState({ r: '', d: '' })
	const [enterSend, setEnterSend] = useState(true)
	const [messageCrnr, setMessageCrnr] = useState(10)

	const [picSelect, setPicSelect] = useState(false)
	const [colSelectChat, setColSelectChat] = useState(false)
	const [colSelectTick, setColSelectTick] = useState(false)

	const saveData = ()=>{
		const preference = {
			customBackground,
			fontSize,
			chatColor,
			tickColor,
			enterSend,
			messageCrnr
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
			}catch(err){
				console.log(err);
			}
			
		}
	},[])
	return (
		<div className="setting-component" >
			<div className="setting-inner">
				<h1>Settings</h1>
				<div className="s-flex-container">
					<div className="s-options">
						<div className="s-options-inner">

							<div className="s-each-options">
								<div className="s-opton-each-content">
									<div className="s-option-title">
										Background
									</div>
									<div className="s-action-place">
										<button onClick={()=>setPicSelect(true)}>
											Select
										</button>
										{picSelect && <BackgroundSelector setFunction={(bg)=>setCustomBackground(bg)} closeTab={()=>setPicSelect(false)}/>}
									</div>
								</div>
							</div>
							<div className="s-each-options">
								<div className="s-opton-each-content">
									<div className="s-option-title">
										Font Size 
									</div>
									<div className="s-action-place">
										<input type="range" max={30} min={7} onChange={(e)=>setFontSize(e.target.value)} defaultValue={20}/>
									</div>
								</div>
							</div>
							<div className="s-each-options">
								<div className="s-opton-each-content">
									<div className="s-option-title">
										Chat Bubble Color
									</div>
									<div className="s-action-place">
										<button onClick={() => setColSelectChat(!colSelectChat)} style={{ background: `linear-gradient(to right, ${chatColor.s} 50%, ${chatColor.r} 50%)` }}>
											Select
										</button>
										{colSelectChat && <ColorSelector selected={chatColor} closeTab={() => setColSelectChat(false)} setFunction={(c) => setChatColor(c)}/>}
									</div>
								</div>
							</div>
							<div className="s-each-options">
								
								<div className="s-opton-each-content">
									<div className="s-option-title">
										Red Tick Color
									</div>
									<div className="s-action-place">
										<button onClick={() => setColSelectTick(!colSelectTick)} style={{ background: `linear-gradient(to right, ${tickColor.d} 50%, ${tickColor.r} 50%)` }}>
											Select
										</button>
										{colSelectTick && <ColorSelector isReadValue={true} selected={tickColor} closeTab={() => setColSelectTick(false)} setFunction={(c) => setTickColor(c)} />}
									</div>
								</div>
							</div>
							<div className="s-each-options">
								<div className="s-opton-each-content">
									<div className="s-option-title">
										Message Corners
									</div>
									<div className="s-action-place">
										<input type="range" defaultValue={messageCrnr} min={0} max={50} onChange={(e)=>setMessageCrnr(e.target.value)}/>
									</div>
								</div>
							</div>
							<div className="s-each-options">
								<div className="s-opton-each-content">
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
								</div>
							</div>

						</div>
						<div className="s-save-settings">
							<button onClick={saveData}>
								Save Changes
							</button>
							<button onClick={reset}>
								Reset Preferences
							</button>
						</div>
					</div>


					{/* chat demo  */}
					<div className="s-chat-demo">
						<div className="s-selected-demo">
							<div className="s-selected-demo-inner">
								<div className="s-demo-image">
									<Logo/>
								</div>
								<div className="s-demo-title">
									Me cHats
								</div>
							</div>
						</div>
						
						<div className="s-chat-demo-inner" style={{ ...convertStringToCss(customBackground) }}>
							<div className="wrapper">
								<div className="message__h type-sent" style={{ borderRadius: `${messageCrnr}px` }}>
									<div className="message__wrapper" style={{ background: chatColor.s, borderRadius: `${messageCrnr}px` }}>
										<div className="message__in">
											<div className="message__content" style={{ color: getContrastColor(chatColor.s), fontSize: `${fontSize}px` }}>
												Me Chat is amazing... {fontSize}
											</div>
											<span className="message__time" style={{ color: getContrastColor(chatColor.s) }}>
												12.49 AM
											</span>
											<span className='message__status'>
												<ReadReceipts status={2} dColor={tickColor.d} rColor={tickColor.r} />
											</span>
										</div>
									</div>
								</div>
								<div className="message__h type-receive" style={{ borderRadius: `${messageCrnr}px` }}>
									<div className="message__wrapper" style={{ background: chatColor.r, borderRadius: `${messageCrnr}px` }}>
										<div className="message__in">
											<div className="message__content" style={{ color: getContrastColor(chatColor.r), fontSize: `${fontSize}px` }}>
												Yah !! For Sure....
											</div>
											<span className="message__time" style={{ color: getContrastColor(chatColor.r) }}>
												12.49 AM
											</span>
											<span className='message__status'>
												<ReadReceipts status={2} dColor={tickColor.d} rColor={tickColor.r} />
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Link to={'/home/chats'} className="profile-page-go-back-btn">
				<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" viewBox="0 0 16 16">
					<path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
				</svg>
			</Link>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Flip}
			/>
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
		<div  className='s-select-popup' ref={tabRef}>
			<div className="-s-select-popup-inner">
				
				<div className="s-list-bgs-inner">
					{bgImages.map((image, i)=>{
						
						//console.log("Array value =>", i,convertStringToCss(image));
						
						return (
							<div className="s-bg-images-each" key={i}>
								<div className="div-s-each-images-inner">
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
	
	if(!isReadValue){
		colors.push({ r: "#242424", d: "#272b37" })
	}else{
		colors.push({ d: "#fff", r: "#00b9da" })
	}
	
	return (
		<div className='s-select-popup' ref={tabRef}>
			<div className="-s-select-popup-inner">
				<div className="s-select-colors">
					{colors.map((c,i )=>{
						console.log(c);
						return (
							<div key={i} style={{ background: `linear-gradient(to right, ${c.s} 50%, ${c.r} 50%)` }} 
							onClick={()=>{
								closeTab();
								setFunction(isReadValue ? { d: c.s, r: c.r }:c);
							}}
								className={selected.r == c.r && selected.s == c.s ? "s-show-colors selected" :"s-show-colors"}>
								
							</div>
						)
						
					})}
					
				</div>
			</div>

		</div>
	)
}



