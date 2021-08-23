import React, {useState} from 'react';
import logo from '../../images/logo.PNG'; 
import logosmall from '../../images/logosmall.png';
import logoverysmall from '../../images/logoverysmall.png';
import classes from './Navbar1.module.css';
import HowItWorks from './HowItWorks';
import { FaBars } from 'react-icons/fa';

const Navbar1 = () => {
	const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

	const howItWorksHandler = () => {
		setIsHowItWorksOpen((prevstate) => !prevstate);
	};

	return (
		<>
		  <nav className = "nav">
	      <div className = "nav-header">
		      <picture>
		      	<source srcSet={logoverysmall} media="(max-width: 325px)" />
		        <source srcSet={logosmall} media="(max-width: 650px)" />
		        <source srcSet={logo} />
		        <img src = {logo} alt = 'parklane' />
		      </picture>
	      </div>

	      <button className = {classes.glowonhover} onClick = {howItWorksHandler}>How it works</button>

	      <button className='btn toggle-btn' onClick = {howItWorksHandler}>
	        <FaBars />
	      </button>
		  </nav>
		  
		  {isHowItWorksOpen && <HowItWorks isHowItWorksOpen = {isHowItWorksOpen} closeHowItWorks = {howItWorksHandler}  />}
		</>
	);
}

export default Navbar1;
