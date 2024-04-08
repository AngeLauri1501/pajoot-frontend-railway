import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Lobbysound from '../../public/assets/sounds/lobby-classic-game.mp3';


const PlayerLobby = () => {
  const { game, setGame, userLogged, setUserLogged, muted, setMuted, isMuted, setIsMuted} = useStore();
  const audioRef = useRef(false);

  useEffect(() => {
    if (audioRef.current && !muted) {
      audioRef.current.play();
    }
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }
  , [isMuted]);

  function toggleMute() {
    setMuted(!muted);
    setIsMuted(!isMuted);
  }

  return (
    <>
    <div className='lobby-container'>
      {game && game.remoteMode &&(
      <>
      <button onClick={toggleMute}>{muted ? 'Desmutear' : 'Mutear'}</button>
      <audio id='lobby-music' src={Lobbysound} loop autoPlay ref={audioRef} />
      </>
      )}
      {userLogged && userLogged.displayName && (
      <div className='lobby-player'>
        <img className='lobby-image' src={userLogged.photoURL} alt={userLogged.displayName} />
        <h1>{userLogged.displayName}</h1>
      </div>
      )}
      <img src='./assets/gif/cat-waiting.gif' className='cat-waiting' alt='Cat-waiting' />
      <p>Esperando a otros jugadores</p>
  
    </div>
    </>
  );
};

export default PlayerLobby;