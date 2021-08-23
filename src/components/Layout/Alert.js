import React, { useEffect } from 'react';

const Alert = (props) => {
  const {isLoading} = props.change;
  const {removeAlert} = props;

  useEffect(() => {
    const time = setTimeout(() => {
      removeAlert();
    }, 3000);

    return () => clearTimeout(time);
  }, [isLoading, removeAlert]);


  return <p className = {`alert alert-${props.type}`}>{props.message}</p>
}

export default Alert;