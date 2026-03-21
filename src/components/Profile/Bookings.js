import React, {useState, useEffect} from 'react';
import Navbar2 from '../Layout/Navbar2';
import Footer from '../Layout/Footer';
import Loader from '../Layout/Loader';
import classes from './Bookings.module.css';
import { useAppContext } from '../../AppContext';

const Bookings = () => {
	const {email, setSearchTerm, token, places} = useAppContext();
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState();

	useEffect(() => {
	  setSearchTerm('');
	}, []);

	let mailId = email;
	mailId = mailId.replace(/\./g, "-");

	// Helper function to check if booking is expired
    const isBookingExpired = (exitTime) => {
        const currentTime = new Date();
        const bookingExitTime = new Date(exitTime);
        return currentTime > bookingExitTime;
    };

    // Helper function to calculate amount (placeholder logic)
    const calculateAmount = (entryTime, exitTime, ratePerHour) => {
        const entry = new Date(entryTime);
        const exit = new Date(exitTime);
        const durationHours = (exit - entry) / (1000 * 60 * 60);
        return (durationHours * ratePerHour).toFixed(2);
    };

	useEffect(() => {
		const fetchBookings = async () => {		
			const response = await fetch(`https://parklane-24dk-default-rtdb.firebaseio.com/bookings/${mailId}.json?auth=${token}`);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const data = await response.json();
			const loadedBookings = [];

			for (const key in data) {
				const placeObj = places.find(p => p.name === data[key].user.place);
                const price = placeObj ? placeObj.price : 0;

				const booking = {
                    ticketId: data[key].user.id,
                    license: data[key].user.license,
                    place: data[key].user.place,
                    entryTime: data[key].user.timeSlot[0],
                    exitTime: data[key].user.timeSlot[1],
                    amount: calculateAmount(data[key].user.timeSlot[0], data[key].user.timeSlot[1], price),
                    isExpired: isBookingExpired(data[key].user.timeSlot[1]),
                    bookingTime: new Date(data[key].user.timeSlot[0]) // For sorting
                };
                loadedBookings.push(booking);
			}

			// Sort bookings: Active bookings first (most recent first), then expired bookings (most recent last)
            loadedBookings.sort((a, b) => {
                if (a.isExpired && !b.isExpired) return 1; // Expired goes after active
                if (!a.isExpired && b.isExpired) return -1; // Active goes before expired
                
                if (!a.isExpired && !b.isExpired) {
                    // Both active: most recent first
                    return b.bookingTime - a.bookingTime;
                } else {
                    // Both expired: most recent last (oldest expired first)
                    return a.bookingTime - b.bookingTime;
                }
            });

			setBookings(loadedBookings);
			setIsLoading(false);
		};
		
		fetchBookings().catch(error => {
			setHttpError(error.message);
			setIsLoading(false);
		});		
	}, [mailId, token, places]);

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
						<div className = {`${classes.col} ${classes["col-1"]}`}>Amount</div>
					</li>
					
					{bookings.map((item, i) => {
						return <li className = {classes["table-row"]} key = {i}>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Ticket ID">
                                {item.ticketId}
                                {item.isExpired && <span className={classes.expired}> (Expired)</span>}
                            </div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "License Plate">{item.license}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Place">{item.place}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Entry Time">{item.entryTime}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Exit Time">{item.exitTime}</div>
							<div className = {`${classes.col} ${classes["col-1"]}`} data-label = "Amount">${item.amount}</div>
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