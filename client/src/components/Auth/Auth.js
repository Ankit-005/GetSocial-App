import React,{useState} from 'react';
import {Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import {useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {signup,signin} from '../../actions/auth';

const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};

const Auth = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);
    


    const handleSubmit = (e) => {
      e.preventDefault();
      
      if(isSignUp){
        dispatch(signup(formData,navigate));
      }
      else{
        dispatch(signin(formData,navigate));
      }
    };

    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]:e.target.value});
    };

    const switchMode = () => {
      setIsSignUp(!isSignUp);
      setShowPassword(false);
    };
    
    function googleSuccess(user) {
      const profile = jwt_decode(user.credential);
      const token = user?.credential;
      // console.log(user.credential);

      try {
        dispatch({type: 'AUTH', data: {profile,token}});
        navigate('/');
      } catch (error) {
        console.log(error);
      }
      
    }

    const googleFailure = () => {
      console.log(`Google Authentication Failed. Please try again.`);
    };

  return (
    <Container element="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{ isSignUp ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignUp && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignUp && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignUp ? 'Sign Up' : 'Sign In' }
          </Button>
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={googleFailure}
            // theme="filled_black"
            size="large"
          />
          <Grid container justifyContent='flex-end'>
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignUp? "Already have an account? SignIn" : "New here? SignUp" }
                </Button>
              </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;