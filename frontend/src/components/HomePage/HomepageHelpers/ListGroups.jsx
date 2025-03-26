import React from 'react'
import './ListGroups.css'

function ListGroups() {
  return (
	<div className='home-groups-container'>
		<div className="home-groups">
			{/* loader */}
			{[1,1,1,1,1,1,1].map(()=>{
				return (
					<div className="home-groups-each">
						<div className="home-group-container">
							<div className="home-group">
								<div className="home-group-avatar">
									GT
								</div>
								<div className="home-group-detail">
									details
								</div>
							</div>
						</div>
					</div>
				)
			})}
			
		</div>
	</div>
  )
}

export default ListGroups
