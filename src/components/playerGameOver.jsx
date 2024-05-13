import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import useStore from '../store';

const PlayerGameOver = () => {
  const { game, userLogged } = useStore();
  const [playerPosition, setPlayerPosition] = useState(null);
  // Obtener la lista de jugadores del juego
  const players = game.gameData.players.players;

  // Ordenar los jugadores por puntuación
  const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);

  const topThreePlayers = sortedPlayers.slice(0, 3);

  useEffect(() => {
    const players = game.gameData.players.players;
    const sortedPlayers = players.sort((a, b) => b.gameData.score - a.gameData.score);
    const userIndex = sortedPlayers.findIndex(player => player.playerId === userLogged.uid);
    
    if (userIndex !== -1) {
      // El jugador está en la lista de jugadores
      const position = userIndex + 1;
      setPlayerPosition(position);
    } else {
      // El jugador no está en la lista de jugadores (por ejemplo, si se desconectó antes del final del juego)
      setPlayerPosition(null);
    }
  }, [game, userLogged]);

  return (
    <div className='time-out'>
      <h1>¡Se acabó el juego!</h1>
      <div className='time-out-remote'>
      {game && game.remoteMode &&(  
      <div className='podium-container'>
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
        </div>
      </div>
      )}
      {playerPosition !== null && playerPosition <= 3 ? (
        <div>
          <p>¡Enhorabuena! Has quedado </p><h2>{playerPosition}º</h2>
          <img src='./assets/gif/cat-win.gif' className='streak-image' alt='Gato victorioso' />
        </div>
      ) : (
        <div>
          <p>Vaya, Has quedado </p><h2>{playerPosition}º</h2>
          <img src='./assets/gif/cat-lose.gif' className='streak-image' alt='Gato perdedor' />
        </div>
      )}
</div>
      <button className='return-button' onClick={() => window.location.href = '/'}>Volver al Inicio</button>
    
    </div>
  );
};

export default PlayerGameOver;
