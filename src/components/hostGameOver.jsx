import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const HostGameOver = () => {
  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha } = useStore();

  // Obtener la lista de jugadores del juego
  const players = game.gameData.players.players;

  // Ordenar los jugadores por puntuación
  const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);

  const topThreePlayers = sortedPlayers.slice(0, 3);

  const restOfPlayers = sortedPlayers.slice(3, 10);

  function handleCloseGame(){
    socket.emit('closeGame', JSON.stringify({ pin: game.pin }));
    window.location.href = '/';
  }

  return (
    <div className='podium-container'>
      <h1>Podium Final</h1>
      <div className='podium-content'>
        <ul className='ranking-list'>
          {/* Mapear y renderizar los jugadores en orden de puntuación */}
          {topThreePlayers.map((player, index) => (
            <li className='ranking-player' key={player.playerId}>
              <img className='ranking-image' src={player.photo} alt={player.name} />
              <p className='player-name'>{player.name}</p>
              <p className='player-score'>{(player.gameData.score).toFixed()}</p>
              <div className='id-number'>
                <p className='id-number-content'>{index + 1}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className='rest-players'>
              <ul className='ranking-list'>
              {/* Mapear y renderizar los jugadores en orden de puntuación */}
              {restOfPlayers.map((player, index) => (
              <li className='ranking-player' key={player.playerId}>
              <p>{(index + 3) + 1}.</p>
              <img className='ranking-image' src={player.photo} alt={player.playerName} />
              <p className='player-name'>{player.name}:</p> <p className='player-score'>{(player.gameData.score).toFixed()}</p>
              </li>
              ))}
              </ul>
              </div>
        <button className='return-button' onClick={(handleCloseGame)}>Volver al Inicio</button>
      </div>
    </div>
  );
};

export default HostGameOver;
