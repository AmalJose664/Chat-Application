import React from 'react'
import SettingComp from '../components/Settings/settingComp'
import PageTransition from './PageTransitions'

function SettingsPage (){
	return (<PageTransition>
	<div>
	<SettingComp/>
		</div></PageTransition>
  )
}

export default SettingsPage

