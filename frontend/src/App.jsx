import React, { useEffect, useState } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import { useAuthStore} from './store/useAuthStore'
import { newtonsCradle, tailChase, leapfrog } from 'ldrs'


import Create from './pages/Create'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import Profile from './pages/Profile'
import SettingsPage from './pages/SettingsPage'
import Home from './pages/Home'
import Friends from './pages/Friends'
import { Component } from './test'






leapfrog.register()
newtonsCradle.register()
tailChase.register()
	

function App() {
	const { authUser, checkAuth } = useAuthStore()
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		
		checkAuth().then(() => setLoading(false));	
	}, []);
	if (loading) return <div className='loader-center'>
		<h3>Me Chat.... </h3>
		< l-newtons-cradle
			size="78"
			speed="1.2"
			color="white"
		></l-newtons-cradle >
		</div>
  return (
	
	<div>
	  <Routes>
		<Route path='/' element={ <LandingPage />}/>
		<Route path='/home/:chatType' element={authUser ?< Home /> : <Navigate to="/login" />}/>
		<Route path='/home' element={authUser ?< Home /> : <Navigate to="/login" />}/>
		<Route path='/login' element={authUser ? <Navigate to="/home/chats" /> : < LoginPage />}/>
		<Route path='/create' element={authUser ? <Navigate to="/home/chats" /> : < Create />}/>
		<Route path='/settings' element={< SettingsPage/>}/>
		<Route path='/profile'  element={authUser ?< Profile /> : <Navigate to="/login" />}/>
		<Route path='/friends/:tab'  element={authUser ?< Friends /> : <Navigate to="/login" />}/>
	
		<Route path='/test' element={< Component/>}/>
	  </Routes>
		
	</div>
  )
}

export default App
