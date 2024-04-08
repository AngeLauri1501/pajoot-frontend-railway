import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Lobbysound from '../../public/assets/sounds/lobby-classic-game.mp3';

const HostLobby = () => {
  const { game, setGame, muted, setMuted, isMuted, setIsMuted} = useStore();
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
  }
  , [isMuted]);

  useEffect(() => {
    // Escuchar evento 'updatePlayerBoard' del socket
    socket.on('updatePlayerBoard', (game) => {
      setGame(game);
    });

    // Detener la escucha del evento 'updatePlayerBoard' cuando el componente se desmonte
    return () => {
      socket.off('updatePlayerBoard');
    };
  }, [setGame]);

  function handleCancelGame() {
    socket.emit('closeGame', JSON.stringify({ pin: game.pin }));
    window.location.href = '/';
  }

  function toggleMute() {
    setMuted(!muted);
    setIsMuted(!isMuted);
  }

  return (
    <div className='lobby-container'>
      <button onClick={toggleMute}>{muted ? 'Desmutear' : 'Mutear'}</button>
      <audio id='lobby-music' src={Lobbysound} loop autoPlay ref={audioRef} />
      <p>Código</p>

      {game && (<h1>{game.pin}</h1>)}

      <p>Jugadores</p>
      <div className='lobby-content'>
        {game && Array.isArray(game.gameData.players.players) ? (
          game.gameData.players.players.map((player, index) => (
            <p className='player-name' key={index}>{player.name}</p>
          ))
        ) : (
          <p>Todavía no hay jugadores</p>
        )}
      </div>
      <div className='lobby-buttons'>
        <button className='lobby-button' onClick={handleCancelGame}>Cancelar</button>
        <button className='lobby-button' onClick={() => socket.emit('startGame', JSON.stringify({ pin: game.pin }))}>Iniciar</button>
      </div>
    </div>
  );
};

export default HostLobby;
