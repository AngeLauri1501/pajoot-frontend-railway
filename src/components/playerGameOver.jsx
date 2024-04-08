import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const PlayerGameOver = () => {
    
  return (
    <div className='time-out'>
        <h1>¡Se acabó el juego!</h1>
    </div>
  );
};

export default PlayerGameOver;