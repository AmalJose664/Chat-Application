
export const filterNotifications = (value)=>{
	const filtered = value.split("__")
	if (filtered[0] =="FRIEND_REQUEST"){
		return ["Friend Request from " + filtered[1], filtered[0].toLocaleLowerCase()]
	}
	else if (filtered[0] == "FRIEND_ACCEPTED"){
		return ["Friend Request from  " + filtered[1] + " Accepted", filtered[0].toLocaleLowerCase()]
	}
	else if (filtered[0] == "FRIEND_REMOVED") {
		return ["Friend Deleted " + filtered[1], filtered[0].toLocaleLowerCase()]
	}
}

export const filterMessageByDay = (messageArray)=>{
	const messageByDay = {}
	messageArray.forEach(message => {
		const messageDate = new Date(message.t);
		const dateKey = messageDate.toISOString().split('T')[0]
		
		
		if(!messageByDay[dateKey]){
			messageByDay[dateKey] = []
		}
		messageByDay[dateKey].push(message)
		
	})
	const newArray = Object.entries(messageByDay).map(([date, groupedMessages]) => {
		return {
			date, groupedMessages, displayDate: new Date(date).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
}
	})
	
	return newArray
	
	
}

export const findYesterdayAndToady = (formatedDate,date )=>{
	
	const today = new Date().toLocaleDateString()
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate()-1)
	
	const dateFromArray = new Date(date).toLocaleDateString()
	if(today == dateFromArray ){
		return 'Today'
	} else if (yesterday.toLocaleDateString() == dateFromArray){
		return 'Yesterday'
	}

	return formatedDate
}
export function getRandomColorInRange(minBrightness = 0, maxBrightness = 255) {
	const getChannel = () =>
		Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) + minBrightness;
	const r = getChannel();
	const g = getChannel();
	const b = getChannel();
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getFileSize(sizeInBytes) {

	if (sizeInBytes < 1024) {
		return `${sizeInBytes} Bytes`;
	} else if (sizeInBytes < 1024 * 1024) {
		return `${(sizeInBytes / 1024).toFixed(2)} KB`;
	} else {
		return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
	}
}

export const APP_Name = "Me Chat..."
