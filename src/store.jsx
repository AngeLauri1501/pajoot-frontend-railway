import {create} from 'zustand';

const useStore = create((set) => ({
  userEmail: null,

  setUserEmail: (email) => set({ userEmail: email }),

  verifiedEmail: null,

  setVerifiedEmail: (email) => set({ verifiedEmail: email }),

  userLogged: null,

  setUserLogged: (user) => set({ userLogged: user }),

  game: null,

  setGame: (currentGame) => set({ game: currentGame }),

  question: null,

  setQuestion: (currentQuestion) => set({ question: currentQuestion }),

  answeredCorrectly: false,

  setAnsweredCorrectly: (correct) => set({ answeredCorrectly: correct }),

  racha: 1,

  setRacha: (racha) => set({ racha: racha }),

  mensajeRacha: null,

  setMensajeRacha: (mensaje) => set({ mensajeRacha: mensaje }),

  muted: false,

  setMuted: (muted) => set({ muted: muted }),

  isMuted: false,

  setIsMuted: (muted) => set({ isMuted: muted }),


  
}));

export default useStore;