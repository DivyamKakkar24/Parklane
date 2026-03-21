import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import classes from './Map.module.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
});

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;

const Map = ({ lat, lon, name, zoom = 15, children }) => {
	const position = [lat, lon];

	return (
		<div className={classes.mapWrapper}>
			<MapContainer
				center={position}
				zoom={zoom}
				scrollWheelZoom={true}
				className={classes.map}
			>
				<TileLayer
					attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`}
					maxZoom={20}
				/>
				<Marker position={position}>
					<Popup>{name}</Popup>
				</Marker>
				{children}
			</MapContainer>
		</div>
	);
};

export default Map;
