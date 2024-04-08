import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Gongsound from '../../public/assets/sounds/Gong.mp3';

const HostTimeUp= () => {

  const { game, setGame, question, setQuestion, muted} = useStore();
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
    <>
    <p className='time-out'>Tiempo Finalizado</p>
    <div className='question-container ranking-container'>
      {!muted && <audio id='timeup-music' src={Gongsound} autoPlay ref={audioRef} />}
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
        <button className='question-button_next' onClick={() => socket.emit('nextQuestion',JSON.stringify({pin:game.pin}))}>Siguiente Pregunta</button>
    </div>
    </>
  );
};

export default HostTimeUp;