import { motion } from "motion/react"

export function Component({ isVisible }) {
	return <motion.div layout
		style={{ justifyContent: isOn ? "flex-start" : "flex-end" }} animate={{ opacity: isVisible ? 1 : 0 }} />
}