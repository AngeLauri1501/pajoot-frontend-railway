import { io } from 'socket.io-client';

const URL = 'https://pajoot-backend-railway-production.up.railway.app';

export const socket = io(URL);