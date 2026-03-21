import React, { useState, useContext, useEffect, useCallback } from 'react';

const AppContext = React.createContext();

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(expirationTime).getTime();

	const remainingTime = adjExpirationTime - currentTime;
	return remainingTime;
};

const retrieveStoredToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expirationTime');

	const remainingTime = calculateRemainingTime(storedExpirationDate);

	if (remainingTime <= 60000) {
		localStorage.removeItem('token');
		localStorage.removeItem('email');
		localStorage.removeItem('expirationTime');
		return null;
	}

	return {
		token: storedToken,
		duration: remainingTime
	};
};

export const ContextProvider = (props) => {
	// Authentication
	const tokenData = retrieveStoredToken();
	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}
	
	const currentEmail = localStorage.getItem('email');

	const [email, setEmail] = useState(currentEmail);
	const [token, setToken] = useState(initialToken);
	const userIsLoggedIn = !!token;


	const emailHandler = (email) => {
		setEmail(email);
		localStorage.setItem('email', email);
	};

	const logoutHandler = useCallback(() => {
		setToken(null);
		setEmail(null);

		localStorage.removeItem('token');
		localStorage.removeItem('email');
		localStorage.removeItem('expirationTime');

		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	const loginHandler = (token, expirationTime) => {
		setToken(token);

		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);

		const remainingTime = calculateRemainingTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};


	useEffect(() => {
		if (tokenData) {
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData, logoutHandler]);


	// Displaying places
	const [loading, setLoading] = useState(true);
	const [places, setPlaces] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [userCenter, setUserCenter] = useState(null);

	const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

	const geocode = useCallback(async (text) => {
		const res = await fetch(
			`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&limit=1&apiKey=${apiKey}`
		);
		if (!res.ok) return null;
		const data = await res.json();
		const feat = data.features && data.features[0];
		return feat ? { lon: feat.properties.lon, lat: feat.properties.lat } : null;
	}, [apiKey]);

	const ipLocate = useCallback(async () => {
		const res = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${apiKey}`);
		if (!res.ok) return null;
		const data = await res.json();
		return data.location
			? { lon: data.location.longitude, lat: data.location.latitude }
			: null;
	}, [apiKey]);

	const fetchPlaces = useCallback(async (center) => {
		const categories = [
			'parking.cars',
			'tourism.attraction',
			'tourism.sights',
			'entertainment',
			'commercial.shopping_mall',
		].join(',');

		const url = `https://api.geoapify.com/v2/places?categories=${categories}&conditions=named&filter=circle:${center.lon},${center.lat},15000&bias=proximity:${center.lon},${center.lat}&limit=60&apiKey=${apiKey}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Something went wrong!');
		}
		const data = await response.json();

		const seen = new Set();
		const result = [];
		for (const feature of data.features) {
			const props = feature.properties;
			const name = props.name || props.address_line1;
			if (!name) continue;
			const key = name.toLowerCase().trim();
			if (seen.has(key)) continue;
			seen.add(key);

			const { lat, lon } = props;
			const isParking = (props.categories || []).some((c) => c.startsWith('parking'));

			result.push({
				id: props.place_id,
				name,
				info: props.formatted || props.address_line2 || '',
				price: isParking ? 40 : 60,
				lat,
				lon,
				image: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lon},${lat}&zoom=15&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${apiKey}`
			});
			if (result.length >= 24) break;
		}
		return result;
	}, [apiKey]);

	// Resolve user's location once: browser geolocation → IP fallback
	useEffect(() => {
		let cancelled = false;

		const fallback = async () => {
			const ip = await ipLocate().catch(() => null);
			if (!cancelled) setUserCenter(ip || { lon: 77.5946, lat: 12.9716 });
		};

		if (!navigator.geolocation) {
			fallback();
		} else {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					if (!cancelled) {
						setUserCenter({ lon: pos.coords.longitude, lat: pos.coords.latitude });
					}
				},
				() => fallback(),
				{ timeout: 8000 }
			);
		}

		return () => { cancelled = true; };
	}, [ipLocate]);

	// Fetch places whenever search term or resolved center changes
	useEffect(() => {
		if (!userCenter) return;
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			let center = userCenter;
			if (searchTerm.trim()) {
				const geo = await geocode(searchTerm.trim());
				if (geo) center = geo;
			}
			const loaded = await fetchPlaces(center);
			if (!cancelled) {
				setPlaces(loaded);
				setLoading(false);
			}
		};

		run().catch((err) => {
			console.log(err);
			if (!cancelled) setLoading(false);
		});

		return () => { cancelled = true; };
	}, [searchTerm, userCenter, geocode, fetchPlaces]);

	return (
		<AppContext.Provider value = {{
			token,
			email,
			loading,
			places,
			searchTerm,
			setSearchTerm,
			isLoggedIn: userIsLoggedIn,
			loginHandler,
			logoutHandler,
			emailHandler
		}}>
			{props.children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};

