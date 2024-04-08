import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import HostGameOver from '../components/hostGameOver';
import HostQuestion from '../components/hostQuestion';
import HostTimeUp from '../components/hostTimeUp';
import HostLobby from '../components/hostLobby';
import useStore from '../store';
import { socket } from '../socket';

const HostGame = () => {

  const [GamePhase, setGamePhase] = useState('WaitingForPlayers');
  const { game, setGame, question, setQuestion} = useStore();
  const navigate = useNavigate();


  useEffect(() => {

    if(!game){
        console.log('No game');
        navigate('/')
        
    }



  },[game])



  useEffect(() => {
    function startGame(question) {
        setQuestion(question);
        setGamePhase('Question');
    }

    function timeUp(game) {
        setGame(game);
        setGamePhase('TimeUp');
    }

    function nextQuestion(question,game) {
        setQuestion(question);
        setGame(game);
        setGamePhase('Question');
    }

    function gameOver(game) {
        setGame(game);
        setGamePhase('GameOver');

    }


    socket.on('startGame', (question) => {
        startGame(question);
    });

    socket.on('timeUp', (game) => {
        timeUp(game);
    });
    
    socket.on('nextQuestion', (question,game) => {
        nextQuestion(question,game);
    });
    socket.on('gameOver', (game) => {
        gameOver(game);
    }
    );


  }, []);


  const renderComponent = () => {
      switch (GamePhase) {
          case 'WaitingForPlayers':
              return <HostLobby />;
          case 'Question':
              return <HostQuestion/>;
          case 'TimeUp':
              return <HostTimeUp/>;
          case 'GameOver':
              return <HostGameOver/>;
          default:
              return null;
      }
  };

  return (
      <div>
          {renderComponent()}
      </div>
  );
};

export default HostGame;