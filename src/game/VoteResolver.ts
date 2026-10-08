import { Player } from "../players/Player.js";
import { Vote } from "./Vote.js";
import { VoteResult } from "./VoteResult.js";
import { DeathResolver } from "./DeathResolver.js";

export class VoteResolver {

    public static resolve(
        votes: Vote[],
        players: Player[]
    ): VoteResult {

        const livingPlayers =
            players.filter(
                player => player.isAlive
            );

        // Ogni giocatore vivo deve votare.
        const votedPlayerIds =
            new Set(
                votes.map(
                    vote => vote.voter.id
                )
            );

        for (const player of livingPlayers) {

            if (!votedPlayerIds.has(player.id)) {
                throw new Error(
                    `${player.name} non ha votato.`
                );
            }
        }

        // Nessun morto può votare.
        for (const vote of votes) {

            if (!vote.voter.isAlive) {
                throw new Error(
                    `${vote.voter.name} è morto e non può votare.`
                );
            }

            if (!vote.target.isAlive) {
                throw new Error(
                    `${vote.target.name} è morto e non può essere votato.`
                );
            }
        }

        // Conteggio voti.
        const voteCounts =
            new Map<string, number>();

        for (const vote of votes) {

            const current =
                voteCounts.get(
                    vote.target.id
                ) ?? 0;

            voteCounts.set(
                vote.target.id,
                current + 1
            );
        }

        if (voteCounts.size === 0) {
            return new VoteResult(null);
        }

        // Troviamo il numero massimo di voti.
        const maxVotes =
            Math.max(
                ...voteCounts.values()
            );

        // Troviamo tutti quelli con il massimo.
        const leaders =
            livingPlayers.filter(
                player =>
                    voteCounts.get(player.id) ===
                    maxVotes
            );

        // Pareggio.
        if (leaders.length > 1) {

            return new VoteResult(
                null,
                leaders
            );
        }

        // Unico vincitore della votazione.
        const eliminated =
            leaders[0];

        DeathResolver.lynch(
            eliminated
        );

        return new VoteResult(
            eliminated
        );
    }
}