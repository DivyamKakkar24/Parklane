import React from 'react';
import classes from './PlacesList.module.css';
import Loader from '../Loader.js';
import Footer from '../Footer.js';
import PlaceItem from './PlaceItem';
import SearchForm from '../SearchForm';
import { useAppContext } from '../../../AppContext';


const PlacesList = () => {
	const {loading, places, searchTerm} = useAppContext();

	if (loading) {
		return <Loader />
	}

	let searchedPlaces = [];
	searchedPlaces = places.filter((item) => {
		return (searchTerm === '') || (item.name.toLowerCase().includes(searchTerm.toLowerCase()));
	});

	return (
		<div>
			<h2 className = {classes.heading}>Our presence</h2>

			<SearchForm />

			{(searchedPlaces.length < 1) && <h3 className = {classes.nothing}>No Places matched your search criteria</h3>}

			{(searchedPlaces.length >= 1) && <div className = {classes['places-center']}>
					{searchedPlaces.map((item) => {
						return <PlaceItem key = {item.id} {...item} />
					})}
				</div>}
				
			<Footer />
		</div>
	);
};

export default PlacesList;