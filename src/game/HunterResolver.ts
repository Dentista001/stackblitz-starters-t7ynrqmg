import { Player } from "../players/Player.js";
import { DeathCause } from "./DeathCause.js";
import { DeathResolver } from "./DeathResolver.js";

export class HunterResolver {

    public static resolve(
        hunter: Player,
        target: Player,
        deathRecords: {
            player: Player;
            cause: DeathCause;
        }[],
        nightNumber: number
    ): void {

        if (hunter.role.name !== "Cacciatore") {
            throw new Error(
                "Solo il Cacciatore può utilizzare questa abilità."
            );
        }

        if (hunter.isAlive) {
            throw new Error(
                "Il Cacciatore deve essere morto."
            );
        }

        // Cerchiamo l'ultima morte del Cacciatore.
        const hunterDeath =
            deathRecords.length > 0
                ? [...deathRecords]
                    .reverse()
                    .find(
                        record =>
                            record.player.id === hunter.id
                    )
                : undefined;

        // Il Cacciatore può sparare SOLO se
        // è stato linciato dal villaggio.
        if (
            !hunterDeath ||
            hunterDeath.cause !== DeathCause.LYNCH
        ) {
            throw new Error(
                "Il Cacciatore può sparare solo se è stato linciato."
            );
        }

        if (!target.isAlive) {
            throw new Error(
                "Il bersaglio del Cacciatore deve essere vivo."
            );
        }

        DeathResolver.kill(
            target,
            DeathCause.HUNTER,
            nightNumber
        );

        console.log(
            `${hunter.name} ha eliminato ${target.name}.`
        );
    }
}