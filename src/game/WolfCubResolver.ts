import { Player } from "../players/Player.js";
import { RoleType } from "../roles/Role.js";
import { Werewolf } from "../roles/Werewolf.js";

export class WolfCubResolver {

    public static awaken(players: Player[]): void {

        for (const player of players) {

            if (
                player.role.type === RoleType.WOLF_CUB &&
                player.wolfCubAwakeningPending &&
                player.isAlive
            ) {

                player.role = new Werewolf();
                player.wolfCubAwakeningPending = false;

                console.log(
                    `${player.name} si è trasformato segretamente in un Lupo Mannaro.`
                );
            }
        }
    }
}