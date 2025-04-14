import React from 'react'

function ReadReceipts({status , rColor='white', dColor='royalblue' }) {
	
	
	if (status==0){
		return (
			<span className='read-receipt-status-read common-read-receipts'>
				<span className="inner-span1" style={{ color: dColor }}>&#x2713;</span>
			</span>
		)
	}else if(status==1){
		return (
			<span className='read-receipt-status-delivered common-read-receipts'>
				<span className="inner-span1" style={{ color: dColor }}>&#x2713;</span>
				<span className="inner-span2" style={{ color: dColor }}>&#x2713;</span>
			</span>
		)
	}else if (status ==2){
		return (
			<span className='read-receipt-status-seen common-read-receipts'>
				<span className="inner-span1" style={{color:rColor}}>&#x2713;</span>
				<span className="inner-span2" style={{ color: rColor }}>&#x2713;</span>
			</span>
		)
	}

}

export default ReadReceipts
