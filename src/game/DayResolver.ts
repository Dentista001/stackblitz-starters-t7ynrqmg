import { Player } from "../players/Player.js";
import { Vote } from "./Vote.js";
import { VoteResolver } from "./VoteResolver.js";
import { VoteResult } from "./VoteResult.js";

export class DayResolver {

    public static resolveVotes(
        votes: Vote[],
        players: Player[]
    ): VoteResult {

        return VoteResolver.resolve(
            votes,
            players
        );
    }
}