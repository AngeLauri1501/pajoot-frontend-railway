import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import app from '../../firebaseConfig';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const NewQuiz = () => {
  const { userLogged, setUserLogged, game, setGame } = useStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [remoteMode, setRemoteMode] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [numQuestions, setNumQuestions] = useState(5); // Estado para el número de preguntas
  const [timeLimit, setTimeLimit] = useState(10); // Estado para el límite de tiempo de respuesta
  const auth = getAuth(app);
  const [errorImage, setErrorImage] = useState(null);

  useEffect(() => {
    socket.on('gameCreated', (game) => {
      setGame(game);
      navigate('/host');
    });
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (game) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (!userLogged) {
      window.location.href = '/';
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión..');

    auth.signOut();
    setUserLogged(null);

    navigate('/');
  };

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    if (e.target.checked) {
      setSelectedThemes([...selectedThemes, theme]);
    } else {
      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
    }
  };

  const handleCreateGame = () => {
    if (selectedThemes.length === 0) {
      setError('Debes seleccionar al menos una temática');
      setErrorImage('./assets/img/error.png');
      return;
    }
    socket.emit('createGame', JSON.stringify({ 
      tematicas: selectedThemes, 
      modoRemoto: remoteMode,
      numPreguntas: numQuestions,
      limiteTiempo: timeLimit 
    }));
  };

  return (
    <>
      <div className='menu-top'>
        <a href='/'>
          <img src='./assets/img/logo-pajoot.png' className='logo-pajoot' alt='Logo-Pajoot' />
        </a>
        {!userLogged && (
          <div className='user-info'>
            <a href='/login' className='login-link'>
              Iniciar sesión
            </a>
            <img src='./assets/img/usuario-de-perfil.png' className='user-avatar' alt='Avatar-Usuario' />
          </div>
        )}
        {userLogged && (
          <div className='user-info'>
            <div className={`dropdown ${dropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
              <button className='dropbtn'>
                <p id='user-display-name' className='login-link'>
                  {userLogged.displayName}
                </p>
                <img
                  src={userLogged.photoURL === null ? './assets/img/usuario-de-perfil.png' : userLogged.photoURL}
                  className='user-avatar'
                  alt='Avatar-Usuario'
                />
              </button>
              <div className='dropdown-content'>
                <div className='triangle'></div>
                <a href='/profile'>Editar Perfil</a>
                <a href='' onClick={handleLogout}>
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <h1>Iniciar un Pajoot</h1>
      <div className='choose-container'>
        <div className='choose-content'>
          <p>Escoge una o más temáticas:</p>
          <div className='choose-container_options'>
            <label className='choose-type'>
            Música
              <input type='checkbox' value='musica' onChange={handleThemeChange} />
            <i></i>
            </label>
            <label className='choose-type'>
            Programación
              <input type='checkbox' value='programacion' onChange={handleThemeChange} />
              <i></i>
            </label>
            <label className='choose-type'>
            Cine
              <input type='checkbox' value='cine' onChange={handleThemeChange} />
              <i></i>
            </label>
            <label className='choose-type'>
            Actualidad
              <input type='checkbox' value='actualidad' onChange={handleThemeChange} />
              <i></i>
            </label>
          </div>
        <div className='choose-select'>
          <label htmlFor='num-questions'>Número de Preguntas: </label>
          <select id='num-questions' value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className='choose-select'>
          <label htmlFor='time-limit'>Tiempo límite (segundos): </label>
          <select id='time-limit' value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </select>
        </div>
        <div className='choose-mode'>
          <p>(Para jugar a distancia, marca la siguiente casilla)</p>
          <div className='choose-mode_check'>
          <label htmlFor='remote-mode' className='choose-type'>Modo Remoto
            <input
              type='checkbox'
              id='remote-mode'
              name='remote-mode'
              checked={remoteMode}
              onChange={() => setRemoteMode(!remoteMode)}
            />
            <i></i>
            </label>
          </div>
        </div>
        </div>
      {error && <div className='error-message'><img src={errorImage} alt='Imagen alerta'className='icono-error'/><p className='error'>{error}</p></div>}
        <button className='start-button' onClick={handleCreateGame}>
          Iniciar Juego
        </button>
      </div>
    </>
  );
};

export default NewQuiz;
