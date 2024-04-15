import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store';
import Lobbysound from '../../public/assets/sounds/lobby-classic-game.mp3';
import Nyancatsound from '../../public/assets/sounds/Nyan-Cat.mp3';

const PlayerLobby = () => {
  const { game, userLogged, muted, setMuted, isMuted, setIsMuted } = useStore();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && !muted) {
      audioRef.current.play();
    }
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  function toggleMute() {
    setMuted(!muted);
    setIsMuted(!isMuted);
  }

  return (
    <>
    <button className='mute-button' onClick={toggleMute}>{muted ? (
      <img src='./assets/img/silenciar.png' alt="Sonido silenciado" />
    ) : (
      <img src='./assets/img/activar.png' alt="Sonido activado" />
    )}</button>

    <div className='lobby-container'>
      {game && game.remoteMode && (
        <>
          {userLogged && userLogged.displayName && userLogged.displayName.toLowerCase() === 'nyan' ? (
            <audio id='lobby-music' src={Nyancatsound} loop autoPlay ref={audioRef} />
          ) : (
            <audio id='lobby-music' src={Lobbysound} loop autoPlay ref={audioRef} />
          )}
        </>
      )}
      {userLogged && userLogged.displayName && (
        <div className='lobby-player'>
          <img className='lobby-image' src={userLogged.photoURL} alt={userLogged.displayName} />
          <h1>{userLogged.displayName}</h1>
        </div>
      )}
      {userLogged && userLogged.displayName && userLogged.displayName.toLowerCase() === 'nyan' ? (
      <img src='./assets/gif/nyan-cat.gif' className='cat-waiting' alt='Cat-waiting' />
      ) : (
      <img src='./assets/gif/cat-waiting.gif' className='cat-waiting' alt='Cat-waiting' />
      )}
      <p>Esperando a otros jugadores</p>
    </div>
    </>
  );
};

export default PlayerLobby;
