import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAppContext } from './AppContext';
import Loader from './components/Layout/Loader';
import PrivateRoute from './components/Auth/PrivateRoute';

const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const BookingsPage = React.lazy(() => import('./pages/BookingsPage'));

function App() {
  const { isLoggedIn } = useAppContext();

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>

        <Route path='/auth'>
          {isLoggedIn ? <Redirect to='/' /> : <AuthPage />}
        </Route>

        <Route path='/profile' exact>
          <Redirect to='/' />
        </Route>

        <PrivateRoute path='/profile/:placeId'>
          <ProfilePage />
        </PrivateRoute>

        <PrivateRoute path='/bookings' exact>
          <BookingsPage />
        </PrivateRoute>

        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Suspense>
  );
}

export default App;
