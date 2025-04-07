import { Link } from "react-router-dom"
function LandingComp() {
	
  return (
	<div>
		landingPage 
		<Link to={'/home/chats'}> Go to Home</Link>
	</div>
  )
}

export default LandingComp
