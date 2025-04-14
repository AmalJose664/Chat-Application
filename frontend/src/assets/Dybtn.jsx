import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
function Dybtn({text = 'default', color='#fff' ,btnNumber=1}) {
	
	const { isLoggginIn, isSigningUp, isUpdatingProfile } = useAuthStore()
	useEffect(() => {
		const btn = document.getElementsByClassName('btns')[btnNumber - 1 ];
		if (btn) {
			const handleMouseMove = (e) => {
				const rect = btn.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				btn.style.setProperty("--x", x + "px");
				btn.style.setProperty("--y", y + "px");
				
			};

			btn.addEventListener('mousemove', handleMouseMove);
			return () => {
				btn.removeEventListener('mousemove', handleMouseMove);
			};

		}
	}, []);
	return isLoggginIn || isSigningUp || isUpdatingProfile ? (<button disabled={isLoggginIn || isSigningUp} className='btncpy' style={{ '--clr': color }} >
		< l-tail-chase
			size="30"
			speed="2.4"
			color="white"
		></l-tail-chase >
	</button>) : (<button disabled={isLoggginIn || isSigningUp || isUpdatingProfile} className='btns' style={{ '--clr': color }} ><span>{text}</span></button>) 
		
}

export default Dybtn
