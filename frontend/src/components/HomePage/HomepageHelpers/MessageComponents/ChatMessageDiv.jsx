import React from 'react'


function ChatMessageDiv({ chatTextArea, typeTimeRef, typeSentRef, setChatMessage, sendTypeStatus=null, closeOnEnter  }) {
	
	const sendOnEnter = (e)=>{
		if (e.key === "Enter") {
			closeOnEnter();
			e.preventDefault();
			chatTextArea.current.innerText=""
		}
	}
	const handleDivChange = (e) => {
		setChatMessage(e.target.innerText.trim());
		
		if(sendTypeStatus){
			if (!typeSentRef.current) {
				sendTypeStatus('TYPE_START')
				typeSentRef.current = true
			}
			if (typeTimeRef.current) {
				clearTimeout(typeTimeRef.current)
			}
			typeTimeRef.current = setTimeout(() => {
				sendTypeStatus('TYPE_STOP')
				typeSentRef.current = false
			}, 2000)
		}
		
	}
  return (
	  <div className="h-m-type-box" onInput={(e) => handleDivChange(e)} onKeyDown={sendOnEnter}
		  suppressContentEditableWarning={true} contentEditable='plaintext-only' ref={chatTextArea}
		  placeholder="Type a message..."
		  data-placeholder="Type a message..."
		  role="textbox"
		  aria-multiline="true"
	  />
  )
}

export default ChatMessageDiv
