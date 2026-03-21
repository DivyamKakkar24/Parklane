import React from 'react';
import {useHistory} from 'react-router-dom';
import classes from './Button.module.css';

const Button = (props) => {
	const history = useHistory();

	const clickHandler = () => {
		const path = props.text === 'Log in' ? '/auth/login' : '/auth/signup';
		history.push(path);
	};

	return (
		<button className = {classes.btn} onClick = {clickHandler}>
			<span>{props.text}</span>
		</button>
	);
};

export default Button;
