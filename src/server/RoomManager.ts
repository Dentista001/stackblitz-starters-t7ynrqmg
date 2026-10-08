import { Game } from '../game/Game.js';
import { Player } from '../players/Player.js';
import { Villager } from '../roles/Villager.js';

// Tempo concesso a un giocatore disconnesso per ricollegarsi
// prima di essere rimosso dalla lobby.
const GRACE_MS = 60_000;

interface Session {
  playerId: string;
  roomId: string;
  socketId: string | null;
  timer: ReturnType<typeof setTimeout> | null;
}

export class RoomManager {
  private readonly rooms: Map<string, Game> = new Map();
  private readonly hosts: Map<string, string> = new Map(); // roomId -> playerId
  private readonly sessions: Map<string, Session> = new Map(); // playerId -> sessione
  private readonly socketToPlayer: Map<string, string> = new Map(); // socketId -> playerId

  // ------------------------------------------------------------
  // Creazione / ingresso
  // ------------------------------------------------------------

  public createRoom(
    roomId: string,
    playerName: string,
    playerId: string,
    socketId: string
  ): Game {
    if (this.rooms.has(roomId)) {
      throw new Error('La stanza esiste già.');
    }

    this.leaveOldSession(playerId);

    const game = new Game(roomId);
    const player = new Player(playerId, playerName, new Villager());

    this.rooms.set(roomId, game);
    this.hosts.set(roomId, playerId);

    game.addPlayer(player);
    this.attachSession(playerId, roomId, socketId);

    return game;
  }

  public joinRoom(
    roomId: string,
    playerName: string,
    playerId: string,
    socketId: string
  ): Game {
    const game = this.rooms.get(roomId);

    if (!game) {
      throw new Error('Stanza non trovata.');
    }

    // Se il giocatore è già in questa stanza, lo ricolleghiamo.
    const existing = this.sessions.get(playerId);
    if (existing && existing.roomId === roomId) {
      this.attachSession(playerId, roomId, socketId);
      return game;
    }

    if (game.phase !== 'LOBBY') {
      throw new Error('La partita è già iniziata.');
    }

    this.leaveOldSession(playerId);

    const player = new Player(playerId, playerName, new Villager());
    game.addPlayer(player);
    this.attachSession(playerId, roomId, socketId);

    return game;
  }

  // ------------------------------------------------------------
  // Riconnessione
  // ------------------------------------------------------------

  /** Chiamata quando un client si ricollega con il suo playerId. */
  public resume(
    playerId: string,
    socketId: string
  ): { roomId: string; game: Game } | undefined {
    const session = this.sessions.get(playerId);

    if (!session) {
      return undefined;
    }

    const game = this.rooms.get(session.roomId);

    if (!game) {
      this.sessions.delete(playerId);
      return undefined;
    }

    this.attachSession(playerId, session.roomId, socketId);

    return { roomId: session.roomId, game };
  }

  /**
   * Chiamata alla disconnessione del socket. Non rimuove subito il
   * giocatore: in lobby aspetta GRACE_MS, a partita iniziata lo tiene.
   * Restituisce la stanza coinvolta (se esiste).
   */
  public handleDisconnect(
    socketId: string,
    onExpire: (roomId: string) => void
  ): string | undefined {
    const playerId = this.socketToPlayer.get(socketId);

    if (!playerId) {
      return undefined; // socket vecchio, già sostituito da uno nuovo
    }

    this.socketToPlayer.delete(socketId);

    const session = this.sessions.get(playerId);

    if (!session) {
      return undefined;
    }

    session.socketId = null;

    const game = this.rooms.get(session.roomId);

    if (game && game.phase === 'LOBBY') {
      if (session.timer) clearTimeout(session.timer);

      session.timer = setTimeout(() => {
        const roomId = this.removeFromRoom(playerId);
        if (roomId) onExpire(roomId);
      }, GRACE_MS);
    }

    return session.roomId;
  }

  // ------------------------------------------------------------
  // Interrogazioni
  // ------------------------------------------------------------

  public getRoom(roomId: string): Game | undefined {
    return this.rooms.get(roomId);
  }

  public getRoomIdOfPlayer(playerId: string): string | undefined {
    return this.sessions.get(playerId)?.roomId;
  }

  public getHost(roomId: string): string | undefined {
    return this.hosts.get(roomId);
  }

  public isHost(roomId: string, playerId: string): boolean {
    return this.hosts.get(roomId) === playerId;
  }

  public isConnected(playerId: string): boolean {
    return this.sessions.get(playerId)?.socketId != null;
  }

  public getRoomPlayers(roomId: string): Player[] {
    return this.rooms.get(roomId)?.players ?? [];
  }

  // ------------------------------------------------------------
  // Interni
  // ------------------------------------------------------------

  private attachSession(
    playerId: string,
    roomId: string,
    socketId: string
  ): void {
    const old = this.sessions.get(playerId);

    if (old) {
      if (old.timer) clearTimeout(old.timer);
      if (old.socketId) this.socketToPlayer.delete(old.socketId);
    }

    this.sessions.set(playerId, { playerId, roomId, socketId, timer: null });
    this.socketToPlayer.set(socketId, playerId);
  }

  /** Se il giocatore era in un'altra stanza in lobby, lo toglie. */
  private leaveOldSession(playerId: string): void {
    const session = this.sessions.get(playerId);

    if (!session) return;

    const game = this.rooms.get(session.roomId);

    if (game && game.phase !== 'LOBBY') {
      throw new Error('Sei già in una partita in corso.');
    }

    this.removeFromRoom(playerId);
  }

  private removeFromRoom(playerId: string): string | undefined {
    const session = this.sessions.get(playerId);

    if (!session) return undefined;

    if (session.timer) clearTimeout(session.timer);
    if (session.socketId) this.socketToPlayer.delete(session.socketId);

    this.sessions.delete(playerId);

    const roomId = session.roomId;
    const game = this.rooms.get(roomId);

    if (!game) return undefined;

    const index = game.players.findIndex((p) => p.id === playerId);

    if (index !== -1) {
      game.players.splice(index, 1);
    }

    if (game.players.length === 0) {
      this.rooms.delete(roomId);
      this.hosts.delete(roomId);
      return undefined;
    }

    // Se se n'è andato l'host, passa al primo giocatore rimasto.
    if (this.hosts.get(roomId) === playerId) {
      this.hosts.set(roomId, game.players[0].id);
    }

    return roomId;
  }
}
