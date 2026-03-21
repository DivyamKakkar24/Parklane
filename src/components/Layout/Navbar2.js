import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import logo from '../../images/logo3.png'; 
import { FaBars } from 'react-icons/fa';
import HowItWorks from './HowItWorks';
import {useAppContext} from '../../AppContext';
import UserIn from './UserIn';
import {
  FaHome,
  FaSignOutAlt,
  FaSignInAlt,
  FaTicketAlt,
  FaQuestion
} from 'react-icons/fa';


const Navbar = () => {
	const {logoutHandler, email, isLoggedIn} = useAppContext();

	const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
	const [showLinks, setShowLinks] = useState(false); 

	const linksContainerRef = useRef(null);
	const linksRef = useRef(null);
	const toggleRef = useRef(null);


	const getoutHandler = () => {
		logoutHandler();
	};

	const howItWorksHandler = () => {
		setIsHowItWorksOpen((prevstate) => !prevstate);
	};

	useEffect(() => {
		const linksHeight = linksRef.current.getBoundingClientRect().height;

		if (showLinks) {
			linksContainerRef.current.style.height = `${linksHeight}px`;
			toggleRef.current.style.transform = 'rotate(90deg)';
			toggleRef.current.style.color = '#19222a';
		}
		else {
			linksContainerRef.current.style.height = '0px';
			toggleRef.current.style.transform = 'rotate(0deg)';
			toggleRef.current.style.color = 'beige';
		}
	}, [showLinks]);


	return (
		<>
			<nav className = "nav2">
				<div className = "nav-center">
					<div className = "nav-header2">
						<Link to = '/'><img src = {logo} className = 'nav-logo' alt = 'parklane' /></Link>
						<button className = "btn toggle-btn" ref = {toggleRef} onClick = {() => setShowLinks(!showLinks)}>
							<FaBars />
						</button>
					</div>
					
					<div className = "links-container" ref = {linksContainerRef}>

						<ul className = "links" ref = {linksRef}>
							{isLoggedIn && (
								<li className = 'splink'>
									<span>{email}</span>
								</li>
							)}
							<li>
								<Link to = '/'><span>{showLinks && <FaHome />} Home</span></Link>
							</li>
							<li>
								<Link to = '/bookings'><span>{showLinks && <FaTicketAlt />} Bookings</span></Link>
							</li>
							<li onClick = {howItWorksHandler}>
								<span style = {{cursor:'pointer'}}>{showLinks && <FaQuestion />} How it works</span>
							</li>
							<li className = 'logout-mobile'>
								{isLoggedIn ? (
									<span onClick = {getoutHandler}>{showLinks && <FaSignOutAlt />} Sign out</span>
								) : (
									<Link to = '/auth/login'><span>{showLinks && <FaSignInAlt />} Sign in</span></Link>
								)}
							</li>
							<div className = 'dot'></div>
						</ul>

					</div>

					{isLoggedIn && <UserIn />}

					{isLoggedIn ? (
						<button className = 'logout-pc' onClick = {getoutHandler}>Sign out</button>
					) : (
						<Link to = '/auth/login'><button className = 'logout-pc'>Sign in</button></Link>
					)}
				</div>
			</nav>

			{isHowItWorksOpen && <HowItWorks isHowItWorksOpen = {isHowItWorksOpen} closeHowItWorks = {howItWorksHandler}  />}
		</>
	);
};

export default Navbar;
