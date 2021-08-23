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

	useEffect(() => {
		const fetchPlaces = async () => {
			setLoading(true);
			const response = await fetch(`https://parklane-24dk-default-rtdb.firebaseio.com/places.json?auth=${token}`);
			if (!response.ok) {
				throw new Error('Something went wrong!');
			}
			
			const data = await response.json();
			const loadedPlaces = [];

			for (const key in data) {
				loadedPlaces.push({
					id: key,
					name: data[key].name,
					info: data[key].info,
					price: data[key].price,
					image: data[key].image
				});
			}

			setPlaces(loadedPlaces);
			setLoading(false);
		};

		fetchPlaces().catch(error => {
			console.log(error);
			setLoading(false);
		});
	}, [token]);

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

