import React from 'react';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, Link} from 'react-router-dom'; 
import useStore from '../store';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from '../../firebaseConfig'; 

const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { userLogged, setUserLogged } = useStore();
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const [errorImage, setErrorImage] = useState(null);

    useEffect(() => {
        setErrorImage('./assets/img/error-red.png');

        if (userLogged) {
            navigate('/');
        }

    }, [userLogged, navigate]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError(null); // Limpiar el mensaje de error cuando el correo se actualiza
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError(null); // Limpiar el mensaje de error cuando el correo se actualiza
    }

    const loginUser = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            return user;
        } catch (error) {
            throw error;
        }
    }

    const signUpWithGoogle = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    setUserLogged(result.user);
                    // IdP data available using getAdditionalUserInfo(result)
                    // ...
                    // You can handle the signed-in user here if needed
                    console.log("Google User Signed In Successfully.");
                    navigate('/');
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData ? error.customData.email : null;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...

                    // You can handle errors here if needed
                    console.error("Error signing in with Google:", errorCode, errorMessage);
                });
        } catch (error) {
            // Handle other errors here
            console.error("Error signing in with Google:", error);
        }
    };



    const mutation = useMutation(loginUser, {
        onSuccess: (user) => {
            console.log('User Logged in correctly:', user);
            navigate('/');
        },
        onError: (error) => {
            console.error('Error Logging in', error.message);
            if (error.code === 'auth/user-not-found') {
                setError('Usuario no encontrado');
            }
            else if (error.code === 'auth/invalid-credential') {
                setError('Usuario o contraseña incorrectos');
            }
            else {
                setError(error.message);
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    };

    const handleAnonAccess = (e) => {
        navigate('/');
    }

    return (
        <>
        <div className="entry-container">
            <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
            <div className="entry-credentials">
                <form onSubmit={handleSubmit} method='POST' className="form-login" action=''>
                    <input type='email' onChange={handleEmailChange} className="form-login_input" name='correu' placeholder="Email" required/>
                    <input type="password" onChange={handlePasswordChange} className="form-login_input" name="contrasenya" placeholder="Contraseña" required/>
                    {error && <div className='error-message'><img src={errorImage} alt='Imagen alerta'className='icono-error'/><p className='error'>{error}</p></div>}
                    <input type='submit' className="form-login_button" value={mutation.isLoading ? 'Accediendo...' : 'Acceder'} disabled= {mutation.isLoading}/>
                </form>
            </div>
            <p className="register-text">Todavía no estás registrado?</p><br/><Link to="/register" className="register-new">Regístrate aquí</Link>
            <hr/>
            <a className="login-google" onClick={signUpWithGoogle} ><img src="./assets/img/logo-google.png" alt="Logo-Google" /></a>
            <p>o</p>
            <a href="" className="login-anonim" onClick={handleAnonAccess}>Acceder de manera anónima</a>
        </div>
        </>
    );
};

export default Login;
