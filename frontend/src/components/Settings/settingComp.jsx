import React, { useState } from 'react'
import { grid } from 'ldrs'
import EmojiPicker from "emoji-picker-react";


grid.register()
function SettingComp() {
	const [text, setText] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const [ntext,setNtext] = useState('')
	const ar = ['data','date1' ,'data3',' data4',' data5' ]
	const handleEmojiClick = (emojiObject) => {
		
		
		setText(text + emojiObject.emoji); // Insert emoji at cursor position
		setShowPicker(false); // Hide picker after selection
	};

	
	return ( 
		<div>
			< l-grid
				size="200"
				speed=".6"
				color="red"
			></l-grid >
			<h1>Page Under Construction</h1> <input type="text" value={ntext} onChange={(e) =>{setNtext(e.target.value);} }/>
			<button
				className="absolute bottom-2 right-2 text-xl"
				onClick={() => setShowPicker(!showPicker)}
			>
				😀
			</button>
			{text}
			{showPicker && (
				<div className="absolute bottom-12 right-0">
					<EmojiPicker lazyLoadEmojis={true} theme='dark' emojiStyle='google' onEmojiClick={handleEmojiClick} />
				</div>
			)}
			
			
		</div>
	)
}


export default SettingComp

