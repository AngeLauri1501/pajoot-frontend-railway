import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Gongsound from '../../public/assets/sounds/Gong.mp3';

const PlayerTimeUp = () => {
  const { game, answeredCorrectly, question, userLogged, muted, mensajeRacha } = useStore();
  const audioRef = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [audioRef]);

  return (
    <>
      <p className='time-out'>Se ha acabado el tiempo</p>
      {game && game.remoteMode && !muted && (
        <audio id='timeup-music' src={Gongsound} autoPlay ref={audioRef} />
      )}
      <div className='question-container answer-container'>

        <h1>Respuesta {answeredCorrectly ? "Correcta!" : "Incorrecta!"}</h1>
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
    </>
  );
};

export default PlayerTimeUp;
