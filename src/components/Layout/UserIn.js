import classes from './UserIn.module.css';
import { useAppContext } from '../../AppContext';

const UserIn = () => {
	const { email } = useAppContext();
 
	return (
		<div className = {classes.user}>
			<p>
				Welcome User {email}!
			</p>
		</div>
	);
};

export default UserIn;