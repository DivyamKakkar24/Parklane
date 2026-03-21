import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAppContext } from '../../AppContext';

const PrivateRoute = ({ children, ...rest }) => {
	const { isLoggedIn } = useAppContext();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				isLoggedIn ? (
					children
				) : (
					<Redirect to={{ pathname: '/auth/login', state: { from: location } }} />
				)
			}
		/>
	);
};

export default PrivateRoute;
