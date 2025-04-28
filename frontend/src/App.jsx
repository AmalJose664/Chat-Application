import React, { useEffect, useState } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import { useAuthStore} from './store/useAuthStore'
import {  tailChase, leapfrog } from 'ldrs'


import Create from './pages/Create'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Profile from './pages/Profile'
import SettingsPage from './pages/SettingsPage'
import Home from './pages/Home'
import Friends from './pages/Friends'
import { Component } from './test'
import { APP_Name } from './lib/chatUtilities'
import { Toaster } from 'sonner'
import SonnerIcons from './assets/SonnerIcons'
import NotFound from './pages/NotFound'

import { dotSpinner } from 'ldrs'
dotSpinner.register()

	




leapfrog.register()
tailChase.register()
	

function App() {
	const { authUser, checkAuth } = useAuthStore()
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		console.log(authUser,"//////////////////////");
		
		checkAuth().then(() => setLoading(false));	
	}, []);
	if (loading) return <div className='loader-center'>
		<h3 style={{marginBottom:'16px'}}>{APP_Name} </h3>
		< l-tail-chase
			size="35"
			speed="1.4"
			color="white"
		></l-tail-chase >
		</div>
  return (
	
	<div>
	  <Routes>
		<Route path='/' element={ <LandingPage />}/>
		<Route path='/home/:chatType' element={authUser ?< Home /> : <Navigate to="/login" />}/>
		<Route path='/home' element={authUser ?< Home /> : <Navigate to="/login" />}/>
		<Route path='/login' element={authUser ? <Navigate to="/home/chats" /> : < LoginPage />}/>
		<Route path='/create' element={authUser ? <Navigate to="/home/chats" /> : < Create />}/>
		<Route path='/settings/:tab' element={< SettingsPage/>}/>
		<Route path='/settings/' element={< SettingsPage/>}/>
		<Route path='/profile/:tab'  element={authUser ?< Profile /> : <Navigate to="/login" />}/>
		<Route path='/friends/:tabType'  element={authUser ?< Friends /> : <Navigate to="/login" />}/>
		<Route path='/profile/'  element={authUser ?< Profile /> : <Navigate to="/login" />}/>
		<Route path='/friends/'  element={authUser ?< Friends /> : <Navigate to="/login" />}/>
	
		<Route path='/analyse' element={authUser ? < Component /> : <Navigate to="/login" />} /> 
		<Route path="*" element={<NotFound />} />
	  </Routes>
		  <Toaster theme='dark' visibleToasts={11}
			  toastOptions={{
				  style: {
					  fontSize:'14px',
					  border:'1px solid royalblue',
				  },
			  }}
			  position="top-center"
			  
			  icons={{
				  success: <SonnerIcons type='tick' color='#1afa71' size={18} />,
				  warning: <SonnerIcons type='warning' color='#fadd1a' size={18} />,
				  info: <SonnerIcons type='info' color='#1abffa' size={18} />,
				  error: <SonnerIcons type='error' color='#fa3b1a' size={18} />

			  }} closeButton={true} />	
	</div>
  )
}

export default App
