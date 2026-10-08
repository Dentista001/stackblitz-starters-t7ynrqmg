import { Player } from "../players/Player.js";
import { DeathCause } from "./DeathCause.js";

export class DeathRecord {
    public readonly player: Player;
    public readonly cause: DeathCause;
    public readonly nightNumber: number | null;

    constructor(
        player: Player,
        cause: DeathCause,
        nightNumber: number | null = null
    ) {
        this.player = player;
        this.cause = cause;
        this.nightNumber = nightNumber;
    }
}