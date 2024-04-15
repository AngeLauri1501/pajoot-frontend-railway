import React, { useState, useEffect } from 'react';
import useStore from '../store';

const PlayerGameOver = () => {
  const { game, userLogged } = useStore();
  const [playerPosition, setPlayerPosition] = useState(null);

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
      {playerPosition !== null && playerPosition <= 3 ? (
        <>
          <p>¡Enhorabuena! Has quedado </p><h1>{playerPosition}º</h1>
          <img src='./assets/gif/cat-win.gif' className='streak-image' alt='Gato victorioso' />
        </>
      ) : (
        <>
        <p>Vaya, no te has clasificado...</p>
        <img src='./assets/gif/cat-lose.gif' className='streak-image' alt='Gato perdedor' />
        </>
      )}
      <button className='return-button' onClick={() => window.location.href = '/'}>Volver al Inicio</button>
    </div>
  );
};

export default PlayerGameOver;
