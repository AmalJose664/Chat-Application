import React from 'react'
import PageTransition from './PageTransitions'
import HomePageComp from '../components/HomePage/HomePageComp'

function Home() {
  return ( 
	 <PageTransition>
	<div>
	  <HomePageComp/>
	  </div>
	</PageTransition> 
  )
}

export default Home
