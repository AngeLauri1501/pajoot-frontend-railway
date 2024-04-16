import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import Countdown from 'react-countdown';
import useStore from '../store';
import question10 from '../../public/assets/sounds/question-groovy-10.mp3';
import question20 from '../../public/assets/sounds/question-groovy-20.mp3';
import question30 from '../../public/assets/sounds/question-groovy-30.mp3';
import question60 from '../../public/assets/sounds/question-groovy-60.mp3';
import question120 from '../../public/assets/sounds/question-groovy-120.mp3';


const HostQuestion = () => {

  const { game, setGame, question, setQuestion, muted, setMuted, isMuted, setIsMuted} = useStore();
  const [targetDate, setTargetDate] = useState(Date.now() + game.timeLimit*1000 + 2000);
  const audioRef = useRef(null);
  const formatTime = ({ minutes, seconds }) => {
    // Puedes personalizar el formato según tus necesidades
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
const audioMap = {
  10: question10,
  20: question20,
  30: question30,
  60: question60,
  120: question120
};

// Obtener la ruta del archivo de audio según el límite de tiempo del juego
const audioSrc = audioMap[game.timeLimit];

useEffect(() => {

  socket.on('updatePlayersAnswered', (game) => {
      setGame(game);
  }
  );
  setTargetDate(Date.now() + game.timeLimit*1000 + 2000);

},[])

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

   
const toggleMute = () => {
  setMuted(!muted);
  setIsMuted(!isMuted);
};
  
  return (
    <>
    <div className='question-container'>
      <audio id='lobby-music' src={audioSrc} autoPlay ref={audioRef} />
      <div className='form-top'>
        <div className="form-verify_countdown">
          <h1><Countdown date={targetDate} renderer={({ minutes, seconds }) => formatTime({ minutes, seconds })} onComplete={() => socket.emit('timeUp',JSON.stringify({pin: game.pin}))}/></h1>
        </div>
        <button className='mute-button' onClick={toggleMute}>{muted ? (
        <img src='./assets/img/silenciar.png' alt="Sonido silenciado" />
        ) : (
        <img src='./assets/img/activar.png' alt="Sonido activado" />
        )}</button> 
      </div>
        <div className='question-content'>
          <p>{question.pregunta}</p>
        </div>
        {game.remoteMode &&(
        <div className='question-buttons'>
          <button className='question-button'><p>A)</p>{question.opciones.a}</button>
          <button className='question-button'><p>B)</p>{question.opciones.b}</button>
          <button className='question-button'><p>C)</p>{question.opciones.c}</button>
          <button className='question-button'><p>D)</p>{question.opciones.d}</button>
        </div>
        )}
        <div className='question-bottom'>
          <div className='question-answered'>
            <p>Han contestado</p><h1 className='question-players'> {game.gameData.playersAnswered} / {game.gameData.players.players.length}</h1><p>jugadores</p>
          </div>
          <button className='question-button_next' onClick={() => socket.emit('timeUp',JSON.stringify({pin: game.pin}))}>Finalizar Tiempo</button>
        </div>
    </div>
    </>
  );
};

export default HostQuestion;
