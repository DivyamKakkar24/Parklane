import React from 'react';
import classes from './PlacesList.module.css';
import Loader from '../Loader.js';
import Footer from '../Footer.js';
import PlaceItem from './PlaceItem';
import SearchForm from '../SearchForm';
import { useAppContext } from '../../../AppContext';


const PlacesList = () => {
	const {loading, places} = useAppContext();

	return (
		<div>
			<h2 className = {classes.heading}>Our presence</h2>

			<SearchForm />

			{loading && <Loader />}

			{!loading && places.length < 1 && (
				<h3 className = {classes.nothing}>No parking found near that location</h3>
			)}

			{!loading && places.length >= 1 && (
				<div className = {classes['places-center']}>
					{places.map((item) => {
						return <PlaceItem key = {item.id} {...item} />
					})}
				</div>
			)}

			<Footer />
		</div>
	);
};

export default PlacesList;