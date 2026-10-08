import { RoleType } from "../roles/Role.js";
import {
    NightAction,
    NightActionType
} from "./NightAction.js";
import { NightState } from "./NightState.js";
import { RoleInspector } from "./RoleInspector.js";

export class AbilityValidator {

    public static canPerformAction(
        action: NightAction,
        nightState: NightState
    ): boolean {

        const actor = action.actor;

        // Il Cacciatore può agire anche da morto.
        if (
            action.type !== NightActionType.HUNTER_SHOT &&
            !actor.isAlive
        ) {
            return false;
        }

        // Un giocatore bloccato non può utilizzare
        // la propria abilità.
        // Il Cacciatore è un'eccezione perché agisce dopo la morte.
        if (
            action.type !== NightActionType.HUNTER_SHOT &&
            nightState.isBlocked(actor)
        ) {
            return false;
        }

        switch (action.type) {

            // =====================================
            // LUPI
            // =====================================

            case NightActionType.WEREWOLF_KILL:
                return RoleInspector.isTrueWerewolf(actor);

            // =====================================
            // PUTTANA
            // =====================================

            case NightActionType.PROSTITUTE_BLOCK:
                return (
                    actor.role.type ===
                    RoleType.PROSTITUTE
                );

            // =====================================
            // GUARDIA
            // =====================================

            case NightActionType.BODYGUARD_PROTECT:
                return (
                    actor.role.type ===
                    RoleType.BODYGUARD &&
                    actor.lastProtectedPlayerId !==
                    action.target.id
                );

            // =====================================
            // VEGGENTE
            // =====================================

            case NightActionType.SEER_CHECK:
                return (
                    actor.role.type ===
                    RoleType.SEER
                );

            // =====================================
            // MEDIUM
            // =====================================

            case NightActionType.MEDIUM_CHECK:
                return (
                    actor.role.type ===
                    RoleType.MEDIUM
                );

            // =====================================
            // MITOMANE
            // =====================================

            case NightActionType.COPYCAT_COPY:
                return (
                    actor.role.type ===
                    RoleType.COPYCAT &&
                    !actor.copycatUsed
                );

            // =====================================
            // CACCIATORE
            // =====================================

            case NightActionType.HUNTER_SHOT:
                return (
                    actor.role.type ===
                    RoleType.HUNTER &&
                    !actor.isAlive
                );

            default:
                return false;
        }
    }
}