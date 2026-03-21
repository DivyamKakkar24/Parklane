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

	const [isLogin, setIsLogin] = useState(null);
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


	const switchAuthModeHandler = (text) => {
		if (text === 'Log in') {
			setIsLogin(true);
		}
		else {
			setIsLogin(false);
		}
	};

	// Displaying places
	const [loading, setLoading] = useState(true);
	const [places, setPlaces] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
	const DEFAULT_CENTER = { lon: 77.5946, lat: 12.9716 };

	const geocode = useCallback(async (text) => {
		const res = await fetch(
			`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(text)}&limit=1&apiKey=${apiKey}`
		);
		if (!res.ok) return null;
		const data = await res.json();
		const feat = data.features && data.features[0];
		return feat ? { lon: feat.properties.lon, lat: feat.properties.lat } : null;
	}, [apiKey]);

	const fetchPlaces = useCallback(async (center) => {
		const url = `https://api.geoapify.com/v2/places?categories=parking&filter=circle:${center.lon},${center.lat},15000&bias=proximity:${center.lon},${center.lat}&limit=20&apiKey=${apiKey}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Something went wrong!');
		}
		const data = await response.json();
		return data.features.map((feature) => {
			const props = feature.properties;
			const { lat, lon } = props;
			return {
				id: props.place_id,
				name: props.name || props.address_line1 || 'Parking Spot',
				info: props.formatted || props.address_line2 || '',
				price: 40,
				lat,
				lon,
				image: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lon},${lat}&zoom=15&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${apiKey}`
			};
		});
	}, [apiKey]);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			let center = DEFAULT_CENTER;
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
	}, [searchTerm, geocode, fetchPlaces]);

	return (
		<AppContext.Provider value = {{
			isLogin,
			token,
			email, 
			loading, 
			places,
			searchTerm,
			setSearchTerm,
			isLoggedIn: userIsLoggedIn,
			switchAuthModeHandler,
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

