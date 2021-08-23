import {useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import classes from './AuthForm.module.css';
import {useAppContext} from '../../AppContext';
import LoadingSpinner from '../Layout/LoadingSpinner';
import Alert from '../Layout/Alert';


const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({show: false, message: '', type: ''});

  const {isLogin, loginHandler, emailHandler} = useAppContext();

  const showAlert = (show = false, type = '', message = '') => {
    setAlert({
      show,
      type,
      message
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // validation
    if ((!enteredEmail.endsWith('.com')) && (!enteredEmail.endsWith('.net')) && (!enteredEmail.endsWith('.org'))) {
      showAlert(true, 'danger', 'Invalid Email');
      return;
    }
    if ((enteredPassword.includes(' ') || enteredPassword.length < 8) && !isLogin) {
      showAlert(true, 'danger', 'Password atleast 8 chars long');
      return;
    }
    
    // after validation
    let url;
    setIsLoading(true);
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAtWBTV6j8wvd0Z_A8sBMTi_yyUddvaGU4';
    }
    else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAtWBTV6j8wvd0Z_A8sBMTi_yyUddvaGU4';
    }

    const response = await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    setIsLoading(false);

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Authentication failed!';

      if (data && data.error && data.error.message) {
        errorMessage = data.error.message;
        const regex = /_/g;
        errorMessage = errorMessage.replace(regex, ' ');
      }
      showAlert(true, 'danger', errorMessage);
    }

    else {
      if (!isLogin) {
        showAlert(true, 'success', 'Successfully Signed Up');
        setTimeout(() => { history.goBack(); }, 2000);
      }
      else {
        showAlert(true, 'success', 'Welcome');
        const expirationTime = new Date(
          new Date().getTime() + (+data.expiresIn * 1000)
        );

        loginHandler(data.idToken, expirationTime.toISOString());
        emailHandler(data.email);

        history.replace('/');
        setTimeout(() => { history.go(0); }, 400);
      }
    }
  };

  return (
    <section className={classes.auth}>

      {alert.show && <Alert {...alert} removeAlert = {showAlert} change = {{isLoading}}/>}

      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      <form onSubmit = {submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input 
            className = {classes.inputs}
            type='email' 
            id='email' 
            ref = {emailInputRef} 
            required 
          />
        </div>

        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input 
            className = {classes.inputs}
            type='password' 
            id='password' 
            ref = {passwordInputRef} 
            required 
          />
        </div>

        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <LoadingSpinner />}
        </div>
      </form>
      
    </section>
  );
};

export default AuthForm;
