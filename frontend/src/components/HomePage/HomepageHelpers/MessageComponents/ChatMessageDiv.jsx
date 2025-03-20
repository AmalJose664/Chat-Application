import React from 'react'
import { useChatStore } from '../../../../store/useChatStore'


function ChatMessageDiv({ chatTextArea, typeTimeRef, typeSentRef }) {
	const setChatMessage = useChatStore(state => state.setChatMessage);
	const sendTypeStatus = useChatStore(state => state.sendTypeStatus)

	const handleDivChange = (e) => {
		setChatMessage(e.target.innerText.trim());
		
		if (!typeSentRef.current){
			sendTypeStatus('TYPE_START')
			typeSentRef.current = true
		}
		if(typeTimeRef.current){
			clearTimeout(typeTimeRef.current)
		}
		typeTimeRef.current = setTimeout(()=>{
			sendTypeStatus('TYPE_STOP')
			typeSentRef.current = false
		},2000)

	}
  return (
	  <div className="h-m-type-box" onInput={(e) => handleDivChange(e)}
		  suppressContentEditableWarning={true} contentEditable='plaintext-only' ref={chatTextArea}
		  placeholder="Type a message..."
		  data-placeholder="Type a message..."
		  role="textbox"
		  aria-multiline="true"
	  />
  )
}

export default ChatMessageDiv
