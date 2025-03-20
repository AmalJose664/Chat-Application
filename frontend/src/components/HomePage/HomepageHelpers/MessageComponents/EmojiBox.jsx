import { motion } from 'framer-motion';
import React, { lazy, Suspense } from 'react'

const EmojiPicker = lazy(() => import('emoji-picker-react'));

const EmojiBox = React.memo(({ handleEmojiClick, isOn }) => {


	console.log("re rednderring");

	return (
		<motion.div initial={{ opacity: 0, scale: .1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1 }}>
			<Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '300px', minHeight: '400px', background: 'rgb(50, 50, 50)', borderRadius: '12px' }}>
				< l-tail-chase
					size="40"
					speed="2"
					color="white"

				></l-tail-chase >

			</div>}>

				<EmojiPicker lazyLoadEmojis={true} theme='dark' emojiStyle='google' onEmojiClick={handleEmojiClick} />
			</Suspense>
		</motion.div>
	)
})

export default EmojiBox
