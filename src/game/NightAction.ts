import { Player } from "../players/Player.js";

export enum NightActionType {
    WEREWOLF_KILL = "WEREWOLF_KILL",
    PROSTITUTE_BLOCK = "PROSTITUTE_BLOCK",
    BODYGUARD_PROTECT = "BODYGUARD_PROTECT",
    SEER_CHECK = "SEER_CHECK",
    MEDIUM_CHECK = "MEDIUM_CHECK",
    COPYCAT_COPY = "COPYCAT_COPY",
    HUNTER_SHOT = "HUNTER_SHOT"
}

export class NightAction {

    public readonly type: NightActionType;
    public readonly actor: Player;
    public readonly target: Player;

    constructor(
        type: NightActionType,
        actor: Player,
        target: Player
    ) {

        // Tutte le azioni normali richiedono un giocatore vivo.
        // Il Cacciatore è l'unica eccezione.
        if (
            type !== NightActionType.HUNTER_SHOT &&
            !actor.isAlive
        ) {
            throw new Error(
                "Un giocatore morto non può compiere questa azione."
            );
        }

        // Il bersaglio deve essere vivo.
        if (!target.isAlive) {
            throw new Error(
                "Non puoi scegliere un giocatore morto."
            );
        }

        // La Guardia può proteggere sé stessa.
        if (
            actor.id === target.id &&
            type !== NightActionType.BODYGUARD_PROTECT
        ) {
            throw new Error(
                "Non puoi scegliere te stesso come bersaglio."
            );
        }

        this.type = type;
        this.actor = actor;
        this.target = target;
    }
}