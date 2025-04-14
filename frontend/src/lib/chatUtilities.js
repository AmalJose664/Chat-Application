
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

export function getContrastColor(hex) {
	if(!hex) return ''
	// Remove # if present
	hex = hex.replace('#', '');

	// Parse r, g, b
	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	// Calculate brightness (YIQ formula)
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;

	// Return black for bright backgrounds, white for dark
	return yiq >= 128 ? '#000000' : '#FFFFFF';
}

export const APP_Name = "Me Chat..."
export let colors = [

	{ s: "#C5F7A4", r: "#FFFFFF" },  // Vibrant WhatsApp green + white
	{ s: "#B8FF8C", r: "#F0F0F0" },  // Bright lime green + light gray
	{ s: "#8CD6FF", r: "#E8E8E8" },  // Bright blue + gray
	{ s: "#FFB7C2", r: "#FFFFFF" },  // Vibrant pink + white
	{ s: "#B79CED", r: "#F5F5F5" },  // Brighter lavender + soft gray
	{ s: "#76E5F5", r: "#CFFAFF" },  // Saturated aqua + light aqua
	{ s: "#95E897", r: "#E3F5D6" },  // Richer mint green + pale green
	{ s: "#FFDB69", r: "#FFF6CC" },  // Golden amber + cream
	{ s: "#C2A99E", r: "#F5F5F5" },  // Rich mocha + light gray
	{ s: "#7CC4FF", r: "#D6EDFF" },  // Vibrant sky blue + light sky
	{ s: "#FF97BC", r: "#FFD6E3" },  // Vibrant pink + pale rose

	{ s: "#9D65FF", r: "#EDE2FF" },  // Purple + light purple
	{ s: "#FF6B6B", r: "#FFE0E0" },  // Coral red + light coral
	{ s: "#5CE1E6", r: "#DFFCFD" },  // Turquoise + light turquoise
	{ s: "#FFD166", r: "#FFF6D6" },  // Marigold + cream
	{ s: "#38B2AC", r: "#D2F0EE" },  // Teal + light teal
	{ s: "#FF9F1C", r: "#FFECD6" },  // Orange + light peach
	{ s: "#7B61FF", r: "#E6E0FF" },  // Indigo + light indigo
	{ s: "#47C083", r: "#DBFFE9" },  // Emerald green + pale mint
	{ s: "#FF7EB6", r: "#FFE4F0" },  // Hot pink + pale pink
	{ s: "#00A7E1", r: "#CCF0FF" },  // Bright blue + pale blue
	{ s: "#9649CB", r: "#EBDAFF" },  // Royal purple + light lilac
	{ s: "#FF5A5F", r: "#FFDBDC" },  // Airbnb red + light red
	{ s: "#00C896", r: "#CCFAED" },  // Seafoam + pale seafoam
	{ s: "#F9C80E", r: "#FFF6D6" },  // Sunflower + cream
	{ s: "#6A7FDB", r: "#E0E5FF" },  // Cornflower blue + pale blue
	{ s: "#86BBD8", r: "#E2F4FF" },  // Steel blue + pale blue
	{ s: "#F26419", r: "#FFDEC3" },  // Burnt orange + peach
	{ s: "#662E9B", r: "#E3D0F5" },  // Deep purple + light lavender
	{ s: "#43AA8B", r: "#D9F3EA" },  // Jade green + pale jade
	{ s: "#FF595E", r: "#FFDBDC" }   // Tomato red + pale red
];

export const convertStringToCss = (data)=>{
	if(!data) return console.log("no image data");
	
	
	const styles = {} 
	
	data.split(';').forEach((style)=>{
		const [attr, value] = style.split(':')
		if(attr && value){
			styles[attr.trim()] = value.trim()
		}
	})

	return styles
}

export const loadPreferences = ()=>{
	const data = localStorage.getItem('ChatUIPrefernc') || false
	const parsePref = JSON.parse(data) 
	if(parsePref)return parsePref
	else{
		return {
			customBackground:'',
			fontSize:16,
			chatColor: { r: '', s: '' },
			tickColor: { r: '', d: '' },
			enterSend:true,
			messageCrnr:10
		}
	}
}

export const bgImages = [
	`background: url('/32947939_491362538070.jpg')center/cover;`,
	
	`backgroundColor: #111111;backgroundImage: linear-gradient(32deg, rgba(0, 0, 0, 0.74) 30px, transparent);backgroundSize: 60px 60px;backgroundPosition: -5px -5px;`,
	
	`--color: rgba(114, 114, 114, 0.3);
	backgroundColor: #191a1a;
  backgroundImage: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  backgroundSize: 55px 55px;`,

  `--s: 200px;
  --c1: #1d1d1d;
  --c2: #4e4f51;
  --c3: #3c3c3c;

  background: repeating-conic-gradient(
        from 30deg,
        #0000 0 120deg,
        var(--c3) 0 180deg
      )
      calc(0.5 * var(--s)) calc(0.5 * var(--s) * 0.577),
    repeating-conic-gradient(
      from 30deg,
      var(--c1) 0 60deg,
      var(--c2) 0 120deg,
      var(--c3) 0 180deg
    );
  backgroundSize: var(--s) calc(var(--s) * 0.577);`,

  `--color: #E1E1E1;
  backgroundColor: #F3F3F3;
  backgroundImage: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  backgroundSize: 55px 55px;`,

  `--s: 82px;
  --c1: #353535;
  --c2: #090909;
  --c3: #252121;

  --_g: var(--c3) 0 120deg, #0000 0;
  background: conic-gradient(from -60deg at 50% calc(100% / 3), var(--_g)),
    conic-gradient(from 120deg at 50% calc(200% / 3), var(--_g)),
    conic-gradient(
      from 60deg at calc(200% / 3),
      var(--c3) 60deg,
      var(--c2) 0 120deg,
      #0000 0
    ),
    conic-gradient(from 180deg at calc(100% / 3), var(--c1) 60deg, var(--_g)),
    linear-gradient(
      90deg,
      var(--c1) calc(100% / 6),
      var(--c2) 0 50%,
      var(--c1) 0 calc(500% / 6),
      var(--c2) 0
    );
  backgroundSize: calc(1.732 * var(--s)) var(--s);`,

  `background: radial-gradient(
        circle farthest-side at 0% 50%,
        #282828 23.5%,
        rgba(255, 170, 0, 0) 0
      )
      21px 30px,
    radial-gradient(
        circle farthest-side at 0% 50%,
        #2c3539 24%,
        rgba(240, 166, 17, 0) 0
      )
      19px 30px,
    linear-gradient(
        #282828 14%,
        rgba(240, 166, 17, 0) 0,
        rgba(240, 166, 17, 0) 85%,
        #282828 0
      )
      0 0,
    linear-gradient(
        150deg,
        #282828 24%,
        #2c3539 0,
        #2c3539 26%,
        rgba(240, 166, 17, 0) 0,
        rgba(240, 166, 17, 0) 74%,
        #2c3539 0,
        #2c3539 76%,
        #282828 0
      )
      0 0,
    linear-gradient(
        30deg,
        #282828 24%,
        #2c3539 0,
        #2c3539 26%,
        rgba(240, 166, 17, 0) 0,
        rgba(240, 166, 17, 0) 74%,
        #2c3539 0,
        #2c3539 76%,
        #282828 0
      )
      0 0,
    linear-gradient(90deg, #2c3539 2%, #282828 0, #282828 98%, #2c3539 0%) 0 0
      #282828;
  backgroundSize: 40px 60px;`,



]
