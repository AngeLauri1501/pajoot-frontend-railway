import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/login';
import Newcount from './pages/newcount';
import Register from './components/register';
import Verify from './components/verify';
import Create from './components/create';
import Home from './pages/home';
import Notfound from './pages/notfound';
import app from '../firebaseConfig'
import HostGame from './pages/hostGame';
import PlayerGame from './pages/playerGame';
import NewQuiz from './pages/newQuiz';
import Profile from './pages/profile';
import useStore from './store';
import { getAuth, onAuthStateChanged } from "firebase/auth";


import { QueryClient, QueryClientProvider } from 'react-query';


function App() {

  const auth = getAuth(app);

  const {userLogged, setUserLogged} = useStore();

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLogged(auth.currentUser);
      } else {
      }
    });

}, [userLogged]);


  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/newcount" element={<Newcount/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/verify" element={<Verify/>} />
        <Route path="/create" element={<Create/>} />
        <Route path="/host" element={<HostGame/>}/>
        <Route path="/game" element={<PlayerGame/>}/>
        <Route path = "/choose" element={<NewQuiz/>}/>
        <Route path = "/profile" element={<Profile/>}/>
        <Route path="/*" element={<Notfound/>} />

      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
