import LandingComp from "../components/Landingpage/LandingComp"
import PageTransition from "./PageTransitions"


function LandingPage() {
  return ( <PageTransition>
	<div>
		<LandingComp/>
	  </div></PageTransition>
  )
}

export default LandingPage