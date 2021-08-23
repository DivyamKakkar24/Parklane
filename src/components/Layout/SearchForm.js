import React, { useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useAppContext } from '../../AppContext';

const SearchForm = () => {
	const searchValue = useRef('');

	const {setSearchTerm} = useAppContext();

	const searchHandler = (event) => {
		event.preventDefault();
		setSearchTerm(searchValue.current.value);
	};

	const searchInstant = () => {
		setSearchTerm(searchValue.current.value);
	};

	return (
		<section className = 'wrap'>
			<form onSubmit = {searchHandler} className = 'search'>
				<input 
					className = 'searchTerm' 
					type = 'text' 
					id = 'parking' 
					placeholder = 'Where do you want to park?' 
					ref = {searchValue} 
					onChange = {searchInstant}
				/>
				
				<button type = 'submit' className = 'searchButton'>
					<FaSearch />
				</button>
			</form>
		</section>
	);
};

export default SearchForm;
