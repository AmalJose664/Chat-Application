import { Link } from "react-router-dom"
import {APP_Name as APP, APP_Name} from '../../lib/chatUtilities'
import HoverBox from "./LandingPageHelpers/HoverBox"
import { motion } from "framer-motion"
import DashBoardICon from "../../assets/DashBoardICon"

import Dybtn from "../../assets/Dybtn"
import './LandingComp.css'
import BlurText from "./LandingPageHelpers/RevealWords"
import RotatingText from "./LandingPageHelpers/RotatingText"
import SendMessage from "../../assets/SendMessage"
import Lock from "../../assets/Lock"
import StarBorder from "./LandingPageHelpers/ShinyBox"
import { useRef } from "react"



function LandingComp() {
	const APP=APP_Name.replace("...", "")
	const gridRef = useRef(null)
	const grids = [
		{
			title:'Personal Chat',
			subTitle:'Chat seamlessly with friends in real-time with a beautiful, intuitive interface.',
			svg: (<SendMessage/>)
		},
		{
			title: 'Group Conversations',
			subTitle: 'Create and join group chats to stay connected with multiple friends at once.',
			svg: (<DashBoardICon type="group" size={24}/>)
		},
		{
			title: "Friend Requests",
			subTitle: "Expand your network by sending and accepting friend requests easily.",
			svg: (<DashBoardICon type="add" size={24}/>)
		},
		{
			title: "Private Groups",
			subTitle: "Create exclusive groups for private conversations with selected members.",
			svg: (<Lock type={'lock'} size={24} />)
		},
		{
			title: "Public Communities",
			subTitle: "Join public groups to connect with people sharing similar interests.",
			svg: (<DashBoardICon type="globe" size={24}/>)
		},
		{
			title: "Instant Connection",
			subTitle: "Experience lightning-fast messaging with real-time delivery.",
			svg: (<DashBoardICon type="zap" size={24}/>)
		}
	]
	const subTextHeading = new String("Connect seamlessly. Chat effortlessly. Build meaningful connections in a whole new way.")
  return (
	<div className="landing-page-component">
		<div className="landing-page-inner">
			<div className="lp-center-part-position">

			</div>
			<div className="lp-center-part">
				<div className="lp-top-title">
					<motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay:  .6 }} className="lp-top-inner">
						<h1>{APP} <span>...</span> </h1>
					</motion.div>
				</div>
				<div className="lp-subtext">
					<div className="lp-subtext-inner">
						
						<BlurText
							text={subTextHeading}
							delay={150}
							animateBy="words"
							direction="bottom"
							onAnimationComplete={()=>{}}
							className="text-2xl mb-8"
						/>
					</div>
				</div>
				  <motion.div className="lp-btns" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: .7 }}>
					<Link to={'/home/chats'} className="lp-btn-started">
						  <Dybtn btnNumber={2} text="Message &#11106;" />
					</Link>
					<Link to={'/login'} className="lp-btn-started">
						<Dybtn btnNumber={1} text="Get Started &#11106;" />
					</Link>
				</motion.div>
				<div className="lp-down-arrow">
					<motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.4 }} 
					onClick={()=>gridRef.current?.scrollIntoView({ behavior: "smooth" })}
					className="l-p-down-arrow-inner">
					&#11163;
				</motion.div>
				
				</div>
			</div>
			<div className="lp-second-center">
				<div className="lp-second-center">
					<RotatingText
						texts={['Chat Seemlessly...', 'Chat Effortlessly...', 'Fast UI','Instant Chats','New Friends...']}
						mainClassName="main-class-reactbits px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
						staggerFrom={"last"}
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "-120%" }}
						staggerDuration={0.025}
						splitLevelClassName="split-level-class overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
						transition={{ type: "spring", damping: 30, stiffness: 400 }}
						rotationInterval={2000}
					/>
				</div>
			</div>
			<div className="lp-grid-outer" ref={gridRef}>
				<div className="lp-grids">
					{
					grids.map((grid, index) => (
						<motion.div key={index} className="each-grid-outer" whileInView={true} whileFocus={true} 
							initial={{ opacity: 0,y:100  }} animate={{ opacity: 1,y:0 }} transition={{ duration: 1, delay: index/2 }}
						>
							<StarBorder
								as="div"
								key={index}
								className="custom-class"
								color="white"
								speed="10s"
							>
								<div className="lp-each-grid"
								>
									<div className="each-grid-inner">
										<div className="grid-svg">
											{grid.svg}
										</div>
										<div className="grid-title">
											{grid.title}
										</div>
										<div className="grid-subtext">
											{grid.subTitle}
										</div>
									</div>
								</div>
							</StarBorder>
						</motion.div>
					))
					}
				</div>
			</div>
			<div className="lp-join-text">
				<div className="lp-shadow-effect">
					<div className="join-text-inner">
						Join to {APP} and Make Your Life Easier
					</div>
					<br />
					<Link to={'/login'} className="join-btn">
						<button className="join-button">
							<span>Join to {APP}</span>
							<svg width="15px" height="10px" viewBox="0 0 13 10">
								<path d="M1,5 L11,5" />
								<polyline points="8 1 12 5 8 9" />
							</svg>
						</button>
					</Link>
					<br />
				</div>
			</div>
			
		</div>
	</div>
  )
}

export default LandingComp
