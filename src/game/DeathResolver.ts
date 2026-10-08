import { Player } from "../players/Player.js";
import { DeathCause } from "./DeathCause.js";
import { DeathRecord } from "./DeathRecord.js";

export class DeathResolver {

    public static kill(
        player: Player,
        cause: DeathCause,
        nightNumber: number | null = null
    ): DeathRecord | null {

        if (!player.isAlive) {
            return null;
        }

        player.isAlive = false;

        const record = new DeathRecord(
            player,
            cause,
            nightNumber
        );

        console.log(
            `${player.name} è morto. Causa: ${cause}`
        );

        return record;
    }

    public static lynch(
        player: Player
    ): DeathRecord | null {

        return this.kill(
            player,
            DeathCause.LYNCH
        );
    }
}