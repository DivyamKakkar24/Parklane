import React, { useState } from 'react';
import classes from './PlaceItem.module.css';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import MapModal from '../Map/MapModal';

const PlaceItem = ({ id, name, info, image, price, lat, lon }) => {
	const [showMap, setShowMap] = useState(false);
	const link = `/profile/${id}`;

	const openMap = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowMap(true);
	};

	const closeMap = () => setShowMap(false);

	return (
		<>
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
					onClick={openMap}
					title='View on map'
				>
					<FaMapMarkerAlt />
				</button>
			</article>
			{showMap && (
				<MapModal
					lat={lat}
					lon={lon}
					name={name}
					address={info}
					onClose={closeMap}
				/>
			)}
		</>
	);
};

export default PlaceItem;
