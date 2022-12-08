 import React, { useState, useEffect } from 'react';
 import {AppBar, Avatar, Button, Toolbar, Typography} from '@material-ui/core';
 import useStyles from './styles';
//  import memoriesLogo from '../../images/memoriesLogo.png';
//  import memoriesText from '../../images/memoriesText.png';
 import getSocialLogo from '../../images/getSocialLogo.png';
 import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
 
 const Navbar = () => {
    const classes = useStyles();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = () => {
        dispatch({type: 'LOGOUT'});
        setUser(null);
        console.log(user);
        navigate('/');
    }

    useEffect(() => {
        const token = user?.token;
        if(token){
            const decodedToken = jwtDecode(token);

            if(decodedToken.exp* 1000 < new Date().getTime())
            logout();
        }
        setUser(JSON.parse(localStorage.getItem('profile')));
    },[location]);

   return (
    <AppBar className={classes.appBar} position="static" color="inherit">
        <Link to="/" className={classes.brandContainer}>
            <img className={classes.image} component={Link} src={getSocialLogo} alt="icon" height="85px" />
        </Link>
        <Toolbar className={classes.toolbar}>
            {user?.profile? (
                <div className={classes.profile}>
                    <Avatar className={classes.purple} alt={user.profile.name} src={user.profile.picture}>{user.profile.name.charAt(0)}</Avatar>
                    <Typography className={classes.userName} variant="h6">{user.profile.name}</Typography>
                    <Button variant='contained' className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                </div>
            ) : (
                <Button component={Link} to="/auth" variant='contained' color="primary">Sign In</Button>
            )}
        </Toolbar>
    </AppBar>
   );
 };
 
 export default Navbar;