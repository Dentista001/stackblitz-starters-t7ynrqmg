import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';

import { RoomManager } from './RoomManager.js';

// ============================================================
// HTML DELLA LOBBY
// ============================================================

const htmlPath = fileURLToPath(
  new URL('../../public/index.html', import.meta.url)
);

const html = readFileSync(htmlPath, 'utf-8');

// ============================================================
// SERVER HTTP
// ============================================================

const httpServer = createServer((request, response) => {
  // Le richieste di Socket.IO devono essere
  // lasciate gestire a Socket.IO.
  if (request.url?.startsWith('/socket.io/')) {
    return;
  }

  // Pagina principale
  if (request.url === '/' || request.url === '/index.html') {
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    response.end(html);

    return;
  }

  // Qualsiasi altra risorsa non esistente
  response.writeHead(404);
  response.end('Not Found');
});

// ============================================================
// SOCKET.IO
// ============================================================

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// ============================================================
// ROOM MANAGER
// ============================================================

const roomManager = new RoomManager();

// ============================================================
// GENERAZIONE CODICE STANZA
// ============================================================

function generateRoomId(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let roomId = '';

  do {
    roomId = '';

    for (let i = 0; i < 4; i++) {
      roomId += characters[Math.floor(Math.random() * characters.length)];
    }
  } while (roomManager.getRoom(roomId));

  return roomId;
}

// ============================================================
// DATI PUBBLICI DEI GIOCATORI
// ============================================================

function getPublicPlayers(roomId: string) {
  return roomManager.getRoomPlayers(roomId).map((player) => ({
    id: player.id,
    name: player.name,
    isAlive: player.isAlive,
  }));
}

// ============================================================
// CONNESSIONE SOCKET
// ============================================================

io.on('connection', (socket) => {
  console.log(`Giocatore connesso: ${socket.id}`);

  // ====================================================
  // CREAZIONE STANZA
  // ====================================================

  socket.on('create_room', (playerName: string, callback) => {
    try {
      const roomId = generateRoomId();

      roomManager.createRoom(roomId, playerName, socket.id);

      socket.join(roomId);

      callback({
        success: true,
        roomId,
        hostId: socket.id,
        players: getPublicPlayers(roomId),
      });

      io.to(roomId).emit('room_updated', {
        roomId,
        hostId: roomManager.getHost(roomId),
        players: getPublicPlayers(roomId),
      });

      console.log(`${playerName} ha creato ` + `la stanza ${roomId}.`);
    } catch (error) {
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto.',
      });
    }
  });

  // ====================================================
  // ENTRATA IN STANZA
  // ====================================================

  socket.on('join_room', (roomId: string, playerName: string, callback) => {
    try {
      const normalizedRoomId = roomId.trim().toUpperCase();

      roomManager.joinRoom(normalizedRoomId, playerName, socket.id);

      socket.join(normalizedRoomId);

      callback({
        success: true,
        roomId: normalizedRoomId,
      });

      io.to(normalizedRoomId).emit('room_updated', {
        roomId: normalizedRoomId,
        hostId: roomManager.getHost(normalizedRoomId),
        players: getPublicPlayers(normalizedRoomId),
      });

      console.log(
        `${playerName} è entrato ` + `nella stanza ` + `${normalizedRoomId}.`
      );
    } catch (error) {
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto.',
      });
    }
  });

  // ====================================================
  // AVVIO PARTITA
  // ====================================================

  socket.on('start_game', (roomId: string, callback) => {
    try {
      const game = roomManager.getRoom(roomId);

      if (!game) {
        throw new Error('Stanza non trovata.');
      }

      // Solo l'host può iniziare
      // la partita.

      if (!roomManager.isHost(roomId, socket.id)) {
        throw new Error(
          'Solo il creatore della stanza può iniziare la partita.'
        );
      }

      game.startGame();

      // Comunichiamo a tutti
      // l'inizio della partita.

      io.to(roomId).emit('game_started', {
        phase: game.phase,
        nightNumber: game.nightNumber,
      });

      callback({
        success: true,
      });

      console.log(`Partita ${roomId} iniziata.`);
    } catch (error) {
      callback({
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto.',
      });
    }
  });

  // ====================================================
  // DISCONNESSIONE
  // ====================================================

  socket.on('disconnect', () => {
    console.log(`Giocatore disconnesso: ${socket.id}`);

    const connection = roomManager.getPlayerConnection(socket.id);

    if (!connection) {
      return;
    }

    const roomId = roomManager.getRoomPlayers('').length;

    roomManager.removePlayer(socket.id);
  });
});

// ============================================================
// AVVIO SERVER
// ============================================================

const PORT = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server Socket.IO avviato sulla porta ${PORT}.`);
});
