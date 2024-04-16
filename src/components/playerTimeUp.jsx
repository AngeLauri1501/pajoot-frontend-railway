import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Gongsound from '../../public/assets/sounds/Gong.mp3';

const PlayerTimeUp = () => {
  const { game, answeredCorrectly, question, userLogged, muted, mensajeRacha } = useStore();
  const audioRef = useRef(false);
  const players = game.gameData.players.players;
  // Ordenar los jugadores por puntuación
  const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [audioRef]);

  return (
    <div className='remote-timeout'>
      
      {game && game.remoteMode && !muted && (
        <audio id='timeup-music' src={Gongsound} autoPlay ref={audioRef} />
      )}
      {game && game.remoteMode &&(  
        <div className='question-container ranking-container'>
            <div className='ranking-content'>
              <h1>Clasificación</h1>
              <ul className='ranking-list'>
              {/* Mapear y renderizar los jugadores en orden de puntuación */}
              {sortedPlayers.map((player, index) => (
              <li className='ranking-player' key={player.playerId}>
              <p>{index + 1}.</p>
              <img className='ranking-image' src={player.photo} alt={player.playerName} />
              {player.name}: {(player.gameData.score).toFixed()}
              </li>
              ))}
              </ul>
            </div>
        </div>
      )}
      <div>
      <div className='question-container answer-container'>

        <h1>¡Respuesta {answeredCorrectly ? "Correcta!" : "Incorrecta!"}</h1>
        {answeredCorrectly ? (
          <img src='./assets/gif/cat-yes.gif' className='answer-image' alt='Gato asintiendo' />
        ) : (
          <img src='./assets/gif/cat-no.gif' className='answer-image' alt='Gato negando' />
        )}
        <div className='answer-correct'>
          <p>La respuesta correcta es:</p><p> {question.opciones[question.respuesta]}</p>
        </div>
      </div>
      {mensajeRacha && (
        <div className='answer-streak'>
          {answeredCorrectly ? (
            <img src='./assets/gif/cat-onfire.gif' className='streak-image' alt='Gato en racha' />
          ) : ( 
            <img src='./assets/gif/cat-cry.gif' className='streak-image' alt='Gato triste' />
          )}
          <p>{mensajeRacha}</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default PlayerTimeUp;
