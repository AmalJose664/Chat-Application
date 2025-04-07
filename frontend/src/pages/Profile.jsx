import React from 'react'
import PageTransition from './PageTransitions'
import ProfileComp from '../components/ProfilePage/ProfileComp'


function Profile() {
  return (
	<PageTransition>
		<ProfileComp/>
	</PageTransition>
  )
}

export default Profile
