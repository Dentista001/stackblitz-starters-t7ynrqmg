import { Player } from "../players/Player.js";

export class Vote {

    public readonly voter: Player;
    public readonly target: Player;

    constructor(
        voter: Player,
        target: Player
    ) {

        if (!voter.isAlive) {
            throw new Error(
                `${voter.name} è morto e non può votare.`
            );
        }

        if (!target.isAlive) {
            throw new Error(
                `${target.name} è morto e non può essere votato.`
            );
        }

        if (voter.id === target.id) {
            throw new Error(
                `${voter.name} non può votare sé stesso.`
            );
        }

        this.voter = voter;
        this.target = target;
    }
}