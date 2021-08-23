import React from 'react';
import classes from './PlaceItem.module.css';
import {Link} from 'react-router-dom';

const PlaceItem = ({id, name, info, image, price}) => {
	const link = `/profile/${id}`;
	
	return (
		<article className = {classes['img-container']}>
			<Link to = {link}>
				<div className = {classes.item}>
					<img src = {image} alt = {name}/>
					<div className={classes.text}>
					  <div className = {classes.name}>
							<h4>{name}</h4>
					  </div>
					</div>
				</div>
			</Link>
		</article>
	);
};

export default PlaceItem;