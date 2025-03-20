import React from 'react'
import FriendsComp from '../components/Friends/FriendsComp'
import PageTransition from './PageTransitions'

function Friends() {
	return (<PageTransition>
	  <div>
		  <FriendsComp/>
		</div></PageTransition >
  )
}

export default Friends
