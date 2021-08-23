import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {useAppContext} from './AppContext';
import Loader from './components/Layout/Loader';

const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const BookingsPage = React.lazy(() => import('./pages/BookingsPage'));
const Presence = React.lazy(() => import('./components/StartingPage/Presence'));

function App() {
  const {isLoggedIn} = useAppContext();

  return (
    <Suspense fallback = {<Loader />}>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>

        <Route path='/auth'>
          {isLoggedIn && <HomePage />}
          {!isLoggedIn && <AuthPage />}
        </Route>

        {isLoggedIn && (
          <Route path='/profile' exact>
            <Presence />
          </Route>
        )}

        {isLoggedIn && (
          <Route path='/bookings' exact>
            <BookingsPage />
          </Route>
        )}

        {isLoggedIn && (
          <Route path = '/profile/:placeId'>
            <ProfilePage />
          </Route>
        )}

        <Route path = '*'>
          <Redirect to = '/' />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default App;
