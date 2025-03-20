import React from 'react'

function SendMessage( {color='white', size='24'}) {
  return (
	  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} fill={color} preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><path d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
  )
}

export default SendMessage
