import React, { useState, useRef } from 'react';

function ChatInput({ onSend }) {
	const [message, setMessage] = useState('');
	const divRef = useRef(null);

	const handleInput = (e) => {
		setMessage(e.target.innerText);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (message.trim()) {
				onSend(message);
				setMessage('');
				divRef.current.innerText = '';
			}
		}
	};

	return (
		<div className="chat-input-container">
			<div
				ref={divRef}
				className="chat-input"
				contentEditable="true"
				onInput={handleInput}
				onKeyDown={handleKeyDown}
				placeholder="Type a message..."
				data-placeholder="Type a message..."
				role="textbox"
				aria-multiline="true"
			/>
			<button
				onClick={() => {
					if (message.trim()) {
						onSend(message);
						setMessage('');
						divRef.current.innerText = '';
					}
				}}
				disabled={!message.trim()}
			>
				Send
			</button>
		</div>
	);
}

export default ChatInput;