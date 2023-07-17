import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../features/userSlice';
//import { selectLoggedIn } from "../features/userSlice";
import { singUp } from '../service/api.service';

function SingUp() {
    const [email, setemail] = useState('');
    const [userName, setuserName] = useState('');
    const [password, setpassword] = useState('');
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    let handleSubmit = (e) => {
        e.preventDefault();
        singUp(email, password, userName)
            .then((Response) => {
                if (Response.ok) {
                    navigate('/');
                    console.log('Ok');
                }
            })
            .catch((e) => console.log(e))
            .finally(() => {
                console.log('finally singUp');
            });
    };

    //useEffect
    useEffect(() => {
        if (user.loggedIn) {
            navigate('/');
        }
    }, [user]);

    return (
        <>
            <div className="container-sm w-100 mx-auto rounded p-5 vh-100">
                <form
                    className="w-75 mx-auto was-validated "
                    onSubmit={handleSubmit}
                >
                    <label>
                        Nom
                        <input
                        type="name"
                        className="form-control mb-3"
                        //id="userName"
                        placeholder="nom"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)}
                        required
                    />
                    </label>
                    
                    <div className="valid-feedback">Nom valide</div>
                    <div className="invalid-feedback">Nom invalide</div>
                    <label>
                         Email
                    <input
                        type="email"
                        className="form-control mb-3"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />

                    </label>
                    

                    <div className="valid-feedback">Email valide</div>
                    <div className="invalid-feedback">Email invalide</div>
                    <label>
                        Mot de passe

                    <input
                        type="password"
                        //id="password"
                        className="form-control mb-3"
                        placeholder="mot de passe"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                    />
          
                    </label>
                    
                    <div className="valid-feedback">Mot de passe valide</div>
                    <div className="invalid-feedback">
                        Mot de passe invalide
                    </div>
                    

                    <div className="text-center mb-3">
                        <button type="submit" className="btn w-75 btn-primary">
                            Créer le compte
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="noCompte">Vous avez déja un compte ?</p>
                    <a href="/">
                        <p className="creatCompte">Connectez vous</p>
                    </a>
                </div>
            </div>
        </>
    );
}

export default SingUp;
