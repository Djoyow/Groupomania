import React, { useEffect, useState } from 'react';
import { apiLogin } from '../service/api.service.js';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser, selectUser, selectLoggedIn } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { saveLocalUser } from '../service/auth.service';
import { notify } from '../service/notification.js';
//import isEmail from 'validator/es/lib/isEmail';
import validator from 'validator';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const user = useSelector(selectUser);
    //const loggedIn = useSelector(selectLoggedIn);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validator.isEmail(email)) {
            notify(false, 'email Incorecte');
            return 0;
        }

        apiLogin(email, password)
            .then((user) => {

                console.log("user: ",user );
                user.message
                    ? notify(false, user.message)
                    : dispatch(
                          saveUser({
                              userId: user.userId,
                              token: user.token,
                              loggedIn: true,
                              isAdmin: user.isAdmin,
                          })
                      );
                saveLocalUser({
                    userId: user.userId,
                    token: user.token,
                    loggedIn: true,
                    isAdmin: user.isAdmin,
                });

                navigate('/post');
            })
            .catch((e) => console.log("catch: ",e))
            .finally(() => {
                console.log('finally login');
            });
    };

    useEffect(() => {
        if (user.loggedIn) {
            navigate('/post');
        }
    }, [user]);

    return (
        <div className="vh-100 p-5 ">
            <div className=" container-fluid h-custom d-flex p-5 col-md-6 justify-content-around flex-column border ">
                <form
                    className="was-validated "
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="form-outline mb-1 form-group">
                    <label > Email 
                    <input
                            type="email"
                            className="form-control mb-3 form-checks"
                            //id="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required
                        />
                    </label>
                        
                        
                        <div className="invalid-feedback">Email invalide</div>
                    </div>
                    <div className="form-outline mb-3">
                    
                        <label > mot de passe
                        <input
                            type="password"
                            className="form-control "
                            placeholder="mot de passe"
                            value={password}
                            required
                            onChange={(e) => setpassword(e.target.value)}
                        />                        
                        </label>
                        

                        <div className="invalid-feedback">
                            Mot de passe invalide
                        </div>
                    </div>
                    <div className="text-center mb-3">
                        <button type="submit" className="btn w-75 btn-primary">
                            Se connecter
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="noCompte ">Vous n'avez pas de compte ?</p>
                    <a href="/singup">
                        <p className="creatCompte">Créer un compte</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
