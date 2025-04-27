
export const filterLastMessage = (message ,myId)=>{

	let messageSplit = message.split('__')
	let userid = messageSplit[messageSplit.length-1]
	if(userid.includes('_')){
		userid = userid.split('_')[1]
	}
	return userid == myId
	
}
export const lastMessage = (message)=>{
	
	message = message.split('__')[0]
	if( message.length > 15){
		message = message.slice(0, 48)+"....."
	}
	return message
}

export const senderFind = (id, myid)=>{
	const sender = id.split("__")[0]
	
	return sender == myid
}