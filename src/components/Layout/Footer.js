import classes from './Footer.module.css';

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<div className = {classes.footer}>
			<footer className = {classes.foot}>
				<span>&copy; {currentYear} Parklane. All Rights Reserved.</span>
			</footer>
		</div>
	);
};

export default Footer;