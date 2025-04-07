import SignupComp from "../components/Signup/SignupComp"
import PageTransition from "./PageTransitions"
import { Flip, ToastContainer, toast } from 'react-toastify';

function Create() {
	return (<PageTransition>
	<div>
			<SignupComp /><ToastContainer
				position="top-left"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Flip}
			/>
	</div></PageTransition>
  )
}

export default Create
