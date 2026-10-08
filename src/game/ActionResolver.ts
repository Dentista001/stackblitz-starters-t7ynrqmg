import { NightAction, NightActionType } from "./NightAction.js";
import { NightState } from "./NightState.js";
import { DeathResolver } from "./DeathResolver.js";
import { DeathCause } from "./DeathCause.js";
import { RoleType } from "../roles/Role.js";
import { DeathRecord } from "./DeathRecord.js";

export class ActionResolver {

    public static resolveWerewolfKill(
        action: NightAction,
        nightState: NightState
    ): DeathRecord | null {

        const target = action.target;

        if (nightState.isProtected(target)) {

            console.log(
                `${target.name} era protetto dalla Guardia e sopravvive.`
            );

            return null;
        }

        // Caso speciale: Cucciolo di Lupo
        if (target.role.type === RoleType.WOLF_CUB) {

            target.wolfCubAwakeningPending = true;

            console.log(
                `${target.name} è stato attaccato dai Lupi, ` +
                `ma la sua morte rimane segreta.`
            );

            return null;
            }
            return DeathResolver.kill(
              target,
              DeathCause.WEREWOLF,
              nightState.nightNumber
            );

        const death = DeathResolver.kill(
            target,
            DeathCause.WEREWOLF,
            nightState.nightNumber
        );

        if (death) {
            console.log(
                `${target.name} è stato eliminato durante la notte.`
            );
        }
    }

    public static resolve(
        action: NightAction,
        nightState: NightState
    ): void {

        switch (action.type) {

            case NightActionType.WEREWOLF_KILL:
                this.resolveWerewolfKill(action, nightState);
                return;

            default:
                throw new Error(
                    `Tipo di azione non gestito da ActionResolver: ${action.type}`
                );
        }
    }
}