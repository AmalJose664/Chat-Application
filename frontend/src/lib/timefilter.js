export const getTime = (time, e)=>{
	let d = new Date(time)
	if(e){
		return d.toLocaleString()
	}
	return d.toLocaleString().split(',')[1]
}
export const statusFilter = (value) => {
	if(value == 0){
		return 'Sent'
	}else if(value == 1){
		return 'Delivered'
	}else if(value == 2){
		return 'Read'
	}
}
export const typeFilter = (value) =>{
	if(value ==0){
		return 'text'
	}else if(value ==1){
		return 'photo'
	}
}