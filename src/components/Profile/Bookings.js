import React, {useState, useEffect} from 'react';
import Navbar2 from '../Layout/Navbar2';
import Footer from '../Layout/Footer';
import Loader from '../Layout/Loader';
import classes from './Bookings.module.css';
import { useAppContext } from '../../AppContext';

const Bookings = () => {
	const {email, setSearchTerm, token} = useAppContext();
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState();

	const currentDate = new Date();

	useEffect(() => {
	  setSearchTerm('');
	}, []);

	let mailId = email;
	mailId = mailId.replace(/\./g, "-");

	useEffect(() => {
		const fetchBookings = async () => {		
			const response = await fetch(`https://parklane-24dk-default-rtdb.firebaseio.com/bookings/${mailId}.json?auth=${token}`);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			const loadedBookings = [];
			const loadedExpiredBookings = [];

			for (const key in data) {
				if (currentDate > new Date(data[key].user.timeSlot[1])) {
					loadedExpiredBookings.push({
						ticketId: data[key].user.id,
						license: data[key].user.license,
						place: data[key].user.place,
						entryTime: data[key].user.timeSlot[0],
						exitTime: data[key].user.timeSlot[1]
					});				
				}
				else {
					loadedBookings.push({
						ticketId: data[key].user.id,
						license: data[key].user.license,
						place: data[key].user.place,
						entryTime: data[key].user.timeSlot[0],
						exitTime: data[key].user.timeSlot[1]
					});
				}
			}

			loadedExpiredBookings.sort((a, b) => new Date(a.exitTime) - new Date(b.exitTime));
			loadedExpiredBookings.reverse();
			loadedBookings.reverse();
			const finalBookings = loadedBookings.concat(loadedExpiredBookings);

			setBookings(finalBookings);
			setIsLoading(false);
		};
		
		fetchBookings().catch(error => {
			setHttpError(error.message);
			setIsLoading(false);
		});		
	}, [mailId, token]);

	if(httpError) {
		return (
			<>
				<Navbar2 />
				<section className = {classes.BookingsError}>
					<p>{httpError}</p>
				</section>
			</>
		);
	}

	return (
		<React.Fragment>
			<Navbar2 />
			<h2 className = {classes.heading}>Your Bookings</h2>

			{isLoading && <Loader />}

			{!isLoading && (<div className = {classes.container}>
				<ul className = {classes["responsive-table"]}>
					<li className = {classes["table-header"]}>
						<div className = {`${classes.col} ${classes["col-1"]}`}>Ticket ID</div>
						<div className = {`${classes.col} ${classes["col-1"]}`}>License Plate</div>
						<div className = {`${classes.col} ${classes["col-1"]}`}>Place</div>
						<div className = {`${classes.col} ${classes["col-1"]}`}>Entry Time</div>
						<div className = {`${classes.col} ${classes["col-1"]}`}>Exit Time</div>
					</li>
					
					{bookings.map((item, i) => {
						return <li className = {classes["table-row"]} key = {i}>
							{(currentDate > (new Date(item.exitTime))) && 
								<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Ticket ID">
									{item.ticketId} <span className = {classes.expired}>Expired</span>
								</div>}

							{(currentDate <= (new Date(item.exitTime))) && 
								<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Ticket ID">{item.ticketId}</div>}

							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "License Plate">{item.license}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Place">{item.place}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Entry Time">{item.entryTime}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Exit Time">{item.exitTime}</div>
						</li>})
					}
				</ul>
			</div>)}

			{!isLoading && (<div className = {classes.note}>
				<div>* There is no need to print anything out! All your bookings are here.</div>
				<div>* Modern Parking lots are equipped with Automatic License Plate Recognition (ALPR).</div>
			</div>)}

			{!isLoading && (<Footer />)}
			
		</React.Fragment>
	);
};

export default Bookings;