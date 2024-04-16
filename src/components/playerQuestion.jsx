import React, { useState, useEffect, useRef} from 'react';
import { socket } from '../socket';
import useStore from '../store';
import Countdown from 'react-countdown';
import question10 from '../../public/assets/sounds/question-groovy-10.mp3';
import question20 from '../../public/assets/sounds/question-groovy-20.mp3';
import question30 from '../../public/assets/sounds/question-groovy-30.mp3';
import question60 from '../../public/assets/sounds/question-groovy-60.mp3';
import question120 from '../../public/assets/sounds/question-groovy-120.mp3';

const PlayerQuestion = () => {
  const formatTime = ({ minutes, seconds }) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
  useEffect(() => {
    socket.on('questionAnswered', (answeredCorrectly) => {
      setAnsweredCorrectly(answeredCorrectly);
      if (answeredCorrectly) {
        setRacha(racha + 0.1);
      }
      else {
        setRacha(1);
      }

      if (answeredCorrectly && racha > 1.1) {
        setMensajeRacha('Estás en racha! x' + racha.toFixed(2));
      }

      if (!answeredCorrectly && racha > 1.1) {
        setMensajeRacha('Perdiste la racha...');
      }

      if (answeredCorrectly && racha <= 1.1) {
        setMensajeRacha('');
      }

      if (!answeredCorrectly && racha <= 1.1) {
        setMensajeRacha('');
      }
      
      setQuestionAnswered(true);
    });
  }, []);

  const audioMap = {
  10: question10,
  20: question20,
  30: question30,
  60: question60,
  120: question120
  };

  // Obtener la ruta del archivo de audio según el límite de tiempo del juego
  const audioSrc = audioMap[game.timeLimit];

  const { game, setGame, question, setQuestion, userLogged, setUserLogged, answeredCorrectly, setAnsweredCorrectly, racha, setRacha, mensajeRacha, setMensajeRacha, muted, setMuted, isMuted, setIsMuted} = useStore();
  const [targetDate, setTargetDate] = useState(Date.now() + game.timeLimit*1000 + 2000);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const score = game.gameData.players.players.find((player) => player.playerId == userLogged.uid).gameData.score;
  const audioRef = useRef(false);
  const audioPath = `../../public/assets/sounds/question-groovy-${game.timeLimit}.mp3`;

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
      {game && game.remoteMode &&(
      <>
      <audio id='lobby-music' src={audioSrc} autoPlay ref={audioRef} />
      </>
      )}
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
        {game && game.remoteMode &&(
        <div className='question-content'>
          <p>{question.pregunta}</p>
        </div>
        )}
        <div className='question-buttons'>
          <button className='question-button' disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"a", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}><p>A)</p>{question.opciones.a}</button>
          <button className='question-button' disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"b", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}><p>B)</p>{question.opciones.b}</button>
          <button className='question-button' disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"c", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}><p>C)</p>{question.opciones.c}</button>
          <button className='question-button' disabled = {questionAnswered} onClick={() => socket.emit('answer', JSON.stringify({gamePin: game.pin, answer:"d", correctAnswer: question.respuesta, playerId:userLogged.uid, racha: racha, timeLeft: targetDate-Date.now()}))}><p>D)</p>{question.opciones.d}</button>
      </div>
      <div className='question-answered'>
        <h1 className='question-score'>Puntuación: {score.toFixed()}</h1>
      </div>
    </div>
    </>
  );
};

export default PlayerQuestion;
