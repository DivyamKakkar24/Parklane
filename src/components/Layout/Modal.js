import React from 'react';

const Modal = (props) => {
	return (
		<aside className = 'sidebar-wrapper show'>
			<div className = 'modal'>
				{props.message}
			</div>	
		</aside>
	);
};

export default Modal;