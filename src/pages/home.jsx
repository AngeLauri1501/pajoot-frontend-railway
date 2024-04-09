import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import useStore from '../store';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import app from '../../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { socket } from '../socket';
import { avatarsArray } from '../components/profileAvatar';

const Home = () => {
    const {userLogged, setUserLogged, game, setGame} = useStore();
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Obtén la función de navegación
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [anonName, setAnonName] = useState(null);
    const [gameCode, setGameCode] = useState(0);
    const auth = getAuth(app);

    // Comprobar si hay un email en el estado global al cargar la página
    useEffect(() => {
        if (userLogged) {
        }

        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setDropdownOpen(false);
            }
        };

        // Agregar event listener al montar el componente
        document.addEventListener('click', handleClickOutside);

        // Limpiar event listener al desmontar el componente
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [userLogged, navigate]);

    useEffect(() => {
        socket.on('playerJoined', (game) => {
          setGame(game);
          navigate('/game')
        });

        socket.on('joinError', (error) => {
            setError(error.message);
            if(anonName){
                setUserLogged(null);
            }
        }
        );
      },[userLogged]);

      useEffect(() => {
        if(game){
            setGame(null);
        }
        if(userLogged){
            if(!userLogged.accessToken){
                setUserLogged(null);
            }
            
        }
        },[]);



    const handleLogout = () => {
        // Cerrar sesión
        console.log('Cerrando sesión..');

        auth.signOut();
        setUserLogged(null);
        
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAnonJoin = (event) => {

        event.preventDefault();
        
        const id = Math.floor(Math.random() * 900000) + 100000;

        let avatar = avatarsArray[Math.floor(Math.random() * avatarsArray.length)];
        
        setUserLogged({displayName:anonName, uid:id, photoURL:avatar});

        socket.emit('playerJoin',JSON.stringify({pin:gameCode, playerName:anonName, playerId:id, photoURL:avatar}))

    }

    const handleUserJoin = (event) => {
        event.preventDefault();
        socket.emit('playerJoin',JSON.stringify({pin:gameCode, playerName:userLogged.displayName, playerId:userLogged.uid, photoURL:userLogged.photoURL}))


    }

    const handleRedirect = (event) => {
        event.preventDefault();
        navigate('/choose')
    }

    return (
        <>
        
            <div className='menu-top'>
                <a href='/'>
                    <img src='./assets/img/logo-pajoot.png' className="logo-pajoot" alt="Logo-Pajoot" />
                </a>
                {!userLogged && (
                <div className='user-info'>
                    <a href='/login' className='login-link'>Iniciar sesión</a>
                    <img src='./assets/img/usuario-de-perfil.png' className='user-avatar' alt='Avatar-Usuario' />
                </div>
                )}
                {userLogged && (
                <div className='user-info'>
                    <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
                        <button className='dropbtn'>
                            <p id='user-display-name' className='login-link'>{userLogged.displayName}</p>
                            <img src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL} className='user-avatar' alt='Avatar-Usuario' />
                        </button>
                        <div className='dropdown-content'>
                            <div className='triangle'></div>
                            <a href='/profile'>Editar Perfil</a>
                            <a href='' onClick={handleLogout}>Cerrar Sesión</a>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <div className="entry-container new-register create-register">
                <h1>¡A jugar!</h1>
                {!userLogged && (
                <div className="entry-credentials new-credentials">
                    <p className='entry-title'>Unirse de manera anónima</p>
                    <form className="form-login form-create" onSubmit={e => handleAnonJoin(e)}>
                        <p>Introduce un nombre</p>
                        <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" maxLength={20} onChange={e => setAnonName(e.currentTarget.value)}required/>
                        <p>Introduce código de juego</p>
                        <input type='number' className="form-login_input" name='codigo' placeholder="Código" min='0' max='99999' onChange={e => setGameCode(e.currentTarget.value)}required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                )}
                {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={e => handleUserJoin(e)}>
                        <p>Introduce código de juego</p>
                        <input type='number' className="form-login_input" name='codigo' placeholder="Código" min='0' max='99999' onChange={e => setGameCode(e.currentTarget.value)}required/>
                        <input type='submit' className="form-login_button" value="Unirse"/>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
                )}

            {userLogged && (
                <div className="entry-credentials new-credentials">
                    <form className="form-login form-create" onSubmit={e => handleRedirect(e)}>
                        <p>Administrar un Pajoot</p>
                        <input type='submit' className="form-login_button" value="Ver Pajoots"/>
                    </form>
                </div>
            )}
            </div>
        </>
    );
};

export default Home;
