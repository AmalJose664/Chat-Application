import { motion } from "framer-motion";
function PageTransition({ children }) {
	return (
		<motion.div
			initial={{ opacity: 0, transform: 'translateY(90px)' }}
			animate={{ opacity: 1, transform: 'translateY(0px)' }}
			exit={{ opacity: 0, transform: 'translateY(90px)' }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</motion.div>
	);
}
export default PageTransition