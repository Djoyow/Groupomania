import '../css/style.css';
import logo from '../images/Logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectLoggedIn } from '../features/userSlice';
import LoginIcon from './loginIcon';
import { deleteLocalUser } from '../service/auth.service';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
//import { useNavigate } from "react-router-dom";

function Header() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    //const loggedIn = useSelector(selectLoggedIn);
    const navigate = useNavigate();

    const handlelogout = (e) => {
        e.preventDefault();
        deleteLocalUser();

        dispatch(dispatch(logout()));
    };

    //useEffect

    useEffect(() => {
        if (!user.loggedIn) {
            console.log('useEffect helder');
            //navigate('/');
        }
    }, [user]);

    return (
        <a
            href="#"
            className="text-dark text-decoration-none header "
            onClick={handlelogout}
        >
            <img src={logo} className="" alt="Icone logout" />

            {user && user.loggedIn ? <LoginIcon /> : <></>}
        </a>
    );
}

export default Header;
