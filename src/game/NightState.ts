import { Player } from "../players/Player.js";
import { NightAction, NightActionType } from "./NightAction.js";

export class NightState {

    public readonly nightNumber: number;

    public readonly actions: NightAction[] = [];

    public readonly blockedPlayers: Set<string> = new Set();

    public readonly protectedPlayers: Set<string> = new Set();

    public werewolfTarget: Player | null = null;

    public seerResult: {
        target: Player;
        isWerewolf: boolean;
    } | null = null;

    public mediumResult: {
        target: Player;
        wasWerewolf: boolean;
    } | null = null;

    public copycatResult: {
        target: Player;
        copied: boolean;
    } | null = null;

    public deaths: {
        player: Player;
        cause: string;
    }[] = [];

    constructor(nightNumber: number) {
        this.nightNumber = nightNumber;
    }

    public addAction(action: NightAction): void {
        this.actions.push(action);
    }

    public isBlocked(player: Player): boolean {
        return this.blockedPlayers.has(player.id);
    }

    public isProtected(player: Player): boolean {
        return this.protectedPlayers.has(player.id);
    }

    public blockPlayer(player: Player): void {
        this.blockedPlayers.add(player.id);
    }

    public protectPlayer(player: Player): void {
        this.protectedPlayers.add(player.id);
    }

    public getActionsOfType(
        type: NightActionType
    ): NightAction[] {
        return this.actions.filter(
            action => action.type === type
        );
    }
}