import React from 'react';
import {useHistory} from 'react-router-dom';
import AuthForm from '../Auth/AuthForm';
import classes from './HeroAuth.module.css';

const Hero = () => {
  const history = useHistory();

  const back = () => {
    history.goBack()
  };

  return (
    <section className = 'hero'>
      <div className = 'main'>
        <div className="container-2">
          <button onClick = {back} className = {classes.back}>
            {'<<'}Back
          </button>
          <AuthForm />
        </div>
      </div>
    </section>
  );
}

export default Hero;