import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useMap } from 'react-leaflet';
import Map from './Map';
import classes from './MapModal.module.css';

const ResizeMap = () => {
	const map = useMap();
	useEffect(() => {
		map.invalidateSize();
	}, [map]);
	return null;
};

const MapModal = ({ lat, lon, name, address, onClose }) => {
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [onClose]);

	return (
		<aside className={classes.backdrop} onClick={onClose}>
			<div className={classes.modal} onClick={(e) => e.stopPropagation()}>
				<header className={classes.header}>
					<div>
						<h3>{name}</h3>
						{address && <p>{address}</p>}
					</div>
					<button className={classes.closeBtn} onClick={onClose}>
						<FaTimes />
					</button>
				</header>
				<div className={classes.mapArea}>
					<Map lat={lat} lon={lon} name={name} zoom={16}>
						<ResizeMap />
					</Map>
				</div>
			</div>
		</aside>
	);
};

export default MapModal;
