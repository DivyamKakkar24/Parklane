import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import classes from './ParkHere.module.css';
import Navbar2 from '../Layout/Navbar2';
import PlaceForm2 from './PlaceForm2';
import Loader from '../Layout/Loader';
import Footer from '../Layout/Footer';
import {useAppContext} from '../../AppContext';
import Modal from '../Layout/Modal';

const ParkHere = () => {
  const {placeId} = useParams();
  const history = useHistory();

  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const {email, setSearchTerm, token} = useAppContext();

  useEffect(() => {
    setSearchTerm('');
  }, []);


  useEffect(() => {
    const fetchPlace = async () => {
      setLoading(true);

      const response = await fetch(`https://parklane-24dk-default-rtdb.firebaseio.com/places.json?auth=${token}`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const loadedPlace = [];

      for (const key in data) {
        if(key === placeId){
          loadedPlace.push({
            id: key,
            name: data[key].name,
            info: data[key].info,
            price: data[key].price,
          });
          break;
        }
      }

      setContent(loadedPlace[0]);
      setLoading(false);
    };

    fetchPlace().catch(error => {
      console.log(error);
      setLoading(false);
    });
  }, [placeId, token]);


  const {name, info, price} = content;

  const bookingHandler = async (userData) => {
    const data = {...userData, place: name};
    let mailId = email;
    mailId = mailId.replace(/\./g, "-");

    setTicketId(userData.id);

    setIsSubmitting(true);
    await fetch(`https://parklane-24dk-default-rtdb.firebaseio.com/bookings/${mailId}.json?auth=${token}`, {
      method: 'POST',
      body: JSON.stringify({
        user: data
      })
    });

    setIsSubmitting(false);
    setDidSubmit(true);
  };

  const closeModal = () => {
    history.replace('/');
    setDidSubmit(false);
  };

  const isSubmittingData = <p>Sending data...</p>;

  const didSubmitData = (
    <React.Fragment>
      <p>Your ticket has been booked!</p>
      <p>Ticket ID: {ticketId}</p>
      <div className = {classes.actions}>
      	<button className = {classes.button} onClick = {closeModal}>Close</button>
      </div>
    </React.Fragment>
  );

  return (
    <>
      <Navbar2 />

      {loading && <Loader />}

      {!loading && (
        <div className = {classes.content}>
          <div className = {classes.inner}>
            <div className = {classes.center}>
              <h2>{name}</h2>
              <p>{info}</p>
              <span>Book for ${price} per hour.</span>
            </div>
          </div>
        </div>
      )}
      
      {!loading && <PlaceForm2 price = {price} onBook = {bookingHandler} />}
      {isSubmitting && <Modal message = {isSubmittingData} />}
      {!isSubmitting && didSubmit && <Modal message = {didSubmitData} />}
      {!loading && <Footer />}
    </>
  );
};

export default React.memo(ParkHere);
