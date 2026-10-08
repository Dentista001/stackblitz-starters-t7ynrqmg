import { Player } from "../players/Player.js";

export class VoteResult {

    public readonly eliminated: Player | null;
    public readonly tiedPlayers: Player[];

    constructor(
        eliminated: Player | null,
        tiedPlayers: Player[] = []
    ) {

        this.eliminated = eliminated;
        this.tiedPlayers = tiedPlayers;
    }

    public isTie(): boolean {
        return this.tiedPlayers.length > 1;
    }
}