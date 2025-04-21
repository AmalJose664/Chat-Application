
function SonnerIcons({ size = 24, color = 'white',type='' }) {
	console.log(type);
	
  
	if(type == "tick"){
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color}  class="bi bi-check-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
			</svg>
	  )
	}if(type == 'error'){
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
			</svg>
		)
	} if (type == 'info') {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} className="bi bi-info-circle-fill" viewBox="0 0 16 16">
				<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
			</svg>
		)
	} if (type == 'warning') {
		return (
			<svg width={size} height={size} fill={color} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 511.999 511.999" xmlSpace="preserve">
				<g>
					<g>
						<path d="M506.43,421.536L291.573,49.394c-15.814-27.391-55.327-27.401-71.147,0L5.568,421.536
			c-15.814,27.391,3.934,61.616,35.574,61.616h429.714C502.485,483.153,522.25,448.938,506.43,421.536z M274.821,385.034
			c0,10.394-8.427,18.821-18.821,18.821s-18.821-8.427-18.821-18.821v-11.239c0-10.394,8.427-18.821,18.821-18.821
			s18.821,8.427,18.821,18.821V385.034z M274.821,311.702c0,10.394-8.427,18.821-18.821,18.821s-18.821-8.427-18.821-18.821v-107.89
			c0-10.394,8.427-18.821,18.821-18.821s18.821,8.427,18.821,18.821V311.702z"/>
					</g>
				</g>
			</svg>
		)
	}
	return ("")
}

export default SonnerIcons
