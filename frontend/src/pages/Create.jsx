import SignupComp from "../components/Signup/SignupComp"
import PageTransition from "./PageTransitions"


function Create() {
	return (<PageTransition>
	<div>
			<SignupComp />
	</div></PageTransition>
  )
}

export default Create
