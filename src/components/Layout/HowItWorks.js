import React from 'react';
import classes from './HowItWorks.module.css';
import { FaTimes } from 'react-icons/fa';

const HowItWorks = (props) => {

  return (
    <aside className = {`${props.isHowItWorksOpen ? 'sidebar-wrapper show' : 'sidebar-wrapper '}`}>

      <div className = 'sidebar'>
        <button className = 'close-btn' onClick = {props.closeHowItWorks}>
          	<FaTimes />
        </button>

        <h3 className = {classes.header}>How it works</h3>

        <ul className = {classes.container}>
          <li className = {classes.item}>
            <span className = {classes.number}>1</span>
            <div className = {classes.content}>
              <div className = {classes.title}>Find your car park!</div>
              <p className = {classes.read}>Sign up and check our presence at hotels, restaurants, airport...</p>
            </div>
          </li>
          <li className = {classes.item}>
            <span className = {classes.number}>2</span>
            <div className = {classes.content}>
              <div className = {classes.title}>Book!</div>
              <p className = {classes.read}>Select date and time, check availability, see prices...</p>
            </div>
          </li>
          <li className = {classes.item}>
            <span className = {classes.number}>3</span>
            <div className = {classes.content}>
              <div className = {classes.title}>And park!</div>
              <p className = {classes.read}>Upon arrival, just show your reservation in the car park.</p>
            </div>            
          </li>
        </ul>
        
        <a className = {classes.car} href="https://www.animatedimages.org/cat-cars-67.htm">
          <img src="https://www.animatedimages.org/data/media/67/animated-car-image-0021.gif" border="0" alt = "park here" />
        </a>
      </div>

    </aside>
  );
}

export default HowItWorks;

