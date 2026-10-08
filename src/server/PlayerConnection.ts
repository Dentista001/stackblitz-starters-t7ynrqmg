import { Player } from "../players/Player.js";

export class PlayerConnection {
    public readonly socketId: string;
    public readonly player: Player;

    constructor(
        socketId: string,
        player: Player
    ) {
        this.socketId = socketId;
        this.player = player;
    }
}