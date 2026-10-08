import { io } from 'socket.io-client';

const mode = process.argv[2];
const playerName = process.argv[3];
const roomId = process.argv[4];

if (!mode || !playerName) {
  console.error('Uso: create <nome> oppure join <nome> <stanza>');
  process.exit(1);
}

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log(`Connesso al server. Socket ID: ${socket.id}`);

  if (mode === 'create') {
    socket.emit(
      'create_room',
      playerName,
      (response: { success: boolean; roomId?: string; error?: string }) => {
        if (!response.success) {
          console.error('Errore:', response.error);
          return;
        }

        console.log(`Stanza creata: ${response.roomId}`);
      }
    );

    return;
  }

  if (mode === 'join') {
    if (!roomId) {
      console.error('Devi specificare il codice della stanza.');
      return;
    }

    socket.emit(
      'join_room',
      roomId,
      playerName,
      (response: { success: boolean; roomId?: string; error?: string }) => {
        if (!response.success) {
          console.error('Errore:', response.error);
          return;
        }

        console.log(`Entrato nella stanza: ${response.roomId}`);
      }
    );

    return;
  }

  console.error('Modalità non valida.');
});

socket.on(
  'room_updated',
  (data: {
    roomId: string;
    players: {
      id: string;
      name: string;
      isAlive: boolean;
    }[];
  }) => {
    console.log(`Stanza ${data.roomId} aggiornata.`);

    console.log('Giocatori:', data.players);
  }
);

socket.on('connect_error', (error) => {
  console.error('Errore di connessione:', error.message);
});
