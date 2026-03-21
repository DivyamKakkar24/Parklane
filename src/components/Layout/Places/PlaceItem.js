import React, { useState } from 'react';
import classes from './PlaceItem.module.css';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import Map from '../Map/Map';

const PlaceItem = ({ id, name, info, image, price, lat, lon }) => {
	const [showMap, setShowMap] = useState(false);
	const link = `/profile/${id}`;

	const toggleMap = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowMap((prev) => !prev);
	};

	return (
		<article className={classes['img-container']}>
			<Link to={link}>
				<div className={classes.item}>
					<img src={image} alt={name} />
					<div className={classes.text}>
						<div className={classes.name}>
							<h4>{name}</h4>
						</div>
					</div>
				</div>
			</Link>
			<button
				type='button'
				className={classes.mapBtn}
				onClick={toggleMap}
				title={showMap ? 'Close map' : 'View on map'}
			>
				{showMap ? <FaTimes /> : <FaMapMarkerAlt />}
			</button>
			{showMap && (
				<div className={classes.mapContainer}>
					<Map lat={lat} lon={lon} name={name} />
				</div>
			)}
		</article>
	);
};

export default PlaceItem;
