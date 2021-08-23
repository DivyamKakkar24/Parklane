import Welcome from '../components/StartingPage/Welcome';
import Presence from '../components/StartingPage/Presence';
import {useAppContext} from '../AppContext';

const HomePage = () => {
  const {isLoggedIn} = useAppContext();

  return (
    <>
      {!isLoggedIn && <Welcome />}
      {isLoggedIn && <Presence />}
    </>
  );
};

export default HomePage;
