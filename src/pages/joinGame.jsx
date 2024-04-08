import react, { useEffect, useState } from "react";
import useStore from "../store";
import { avatarsArray } from '../components/profileAvatar';
import { useNavigate, useParams} from 'react-router-dom';
import { socket } from '../socket';

function JoinGame() {
    const { game, setGame, userLogged, setUserLogged} = useStore();
    const [anonName, setAnonName] = useState('');
    const { pin } = useParams();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userLogged) {
            socket.emit('playerJoin',JSON.stringify({pin:pin, playerName:userLogged.displayName, playerId:userLogged.uid, photoURL:userLogged.photoURL}))  
        }
    }, [userLogged]);

    useEffect(() => {
        socket.on('playerJoined', (game) => {
          setGame(game);
          navigate('/game')
        });

        socket.on('joinError', (error) => {
            setError(error.message);
            if(anonName){
                setUserLogged(null);
            }
        }
        );
      },[userLogged]);

    const handleAnonJoin = (event) => {

        event.preventDefault();
        
        const id = Math.floor(Math.random() * 900000) + 100000;

        let avatar = avatarsArray[Math.floor(Math.random() * avatarsArray.length)];
        
        setUserLogged({displayName:anonName, uid:id, photoURL:avatar});

        socket.emit('playerJoin',JSON.stringify({pin:pin, playerName:anonName, playerId:id, photoURL:avatar}))

    }

    return (
    <>
    {!userLogged && (
    <div className="entry-credentials new-credentials">
        <p className='entry-title'>Unirse mediante QR</p>
        <form className="form-login form-create" onSubmit={e => handleAnonJoin(e)}>
            <p>Introduce un nombre</p>
            <input type='text' className="form-login_input" name='nombre' placeholder="Nombre" onChange={e => setAnonName(e.currentTarget.value)}required/>
            <input type='submit' className="form-login_button" value="Unirse"/>
            {error && <p className="error-message">{error}</p>}
        </form>
    </div>
    )}
    </>
    );
}

export default JoinGame;