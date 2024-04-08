import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const PlayerGameClosed = () => {
    
  return (
    <div className='admin-close'>
      <h1>Oops!</h1>
        <p>El administrador ha cerrado el juego.</p>
        <img src='./assets/gif/cat-confused.gif' className='answer-image' alt='Gato con interrogantes' />
        <button className='return-button' onClick={() => window.location.href = '/'}>Volver al inicio</button>
    </div>
  );
};

export default PlayerGameClosed;
