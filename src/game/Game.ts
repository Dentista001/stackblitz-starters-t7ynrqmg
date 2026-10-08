import { Player } from "../players/Player.js";
import { RoleType } from "../roles/Role.js";

import { RoleAssigner } from "./RoleAssigner.js";

import { NightAction } from "./NightAction.js";
import { NightState } from "./NightState.js";
import { NightResolver } from "./NightResolver.js";

import { Vote } from "./Vote.js";
import { DayResolver } from "./DayResolver.js";
import { VoteResult } from "./VoteResult.js";

import {
    WinCondition,
    WinningTeam
} from "./WinCondition.js";

import { HunterResolver } from "./HunterResolver.js";
import { DeathRecord } from "./DeathRecord.js";
import { DeathCause } from "./DeathCause.js";

export enum GamePhase {
    LOBBY = "LOBBY",
    NIGHT = "NIGHT",
    DAY = "DAY",
    VOTING = "VOTING",
    ENDED = "ENDED"
}

export class Game {

    public readonly id: string;

    public players: Player[] = [];

    public phase: GamePhase = GamePhase.LOBBY;

    public nightNumber = 0;

    public previousNightState: NightState | null = null;

    public winner: WinningTeam = WinningTeam.NONE;

    public lastVoteResult: VoteResult | null = null;

    // Cronologia delle morti reali
    public deathRecords: DeathRecord[] = [];

    constructor(id: string) {
        this.id = id;
    }

    public addPlayer(player: Player): void {

        if (this.phase !== GamePhase.LOBBY) {
            throw new Error(
                "Non puoi entrare in una partita già iniziata."
            );
        }

        this.players.push(player);
    }

    public startGame(): void {

        if (this.players.length < 4) {
            throw new Error(
                "Servono almeno 4 giocatori per iniziare."
            );
        }

        this.players =
            RoleAssigner.assignRoles(this.players);

        this.nightNumber = 1;

        this.previousNightState = null;

        this.winner =
            WinningTeam.NONE;

        this.lastVoteResult = null;

        this.deathRecords = [];

        this.phase =
            GamePhase.NIGHT;
    }

    public resolveNight(
        actions: NightAction[]
    ): NightState {

        if (this.phase !== GamePhase.NIGHT) {
            throw new Error(
                "La partita non è nella fase notturna."
            );
        }

        const nightState =
            new NightState(this.nightNumber);

        const newDeaths =
            NightResolver.resolve(
                actions,
                this.players,
                nightState,
                this.previousNightState,
                this.deathRecords
            );

        // Aggiunge alla cronologia le morti
        // avvenute durante questa notte.
        this.deathRecords.push(
            ...newDeaths
        );

        this.previousNightState =
            nightState;

        this.checkVictory();

        if (
            this.winner === WinningTeam.NONE
        ) {
            this.phase =
                GamePhase.DAY;
        }

        return nightState;
    }

    public startVoting(): void {

        if (this.phase !== GamePhase.DAY) {
            throw new Error(
                "La votazione può iniziare solo durante il giorno."
            );
        }

        this.phase =
            GamePhase.VOTING;
    }

    public resolveVoting(
        votes: Vote[],
        hunterTarget?: Player
    ): VoteResult {

        if (this.phase !== GamePhase.VOTING) {
            throw new Error(
                "Non è il momento di votare."
            );
        }

        const result =
            DayResolver.resolveVotes(
                votes,
                this.players
            );

        this.lastVoteResult =
            result;

        // Nessun linciaggio
        if (result.eliminated === null) {

            this.checkVictory();

            if (
                this.winner === WinningTeam.NONE
            ) {
                this.phase =
                    GamePhase.DAY;
            }

            return result;
        }

        const eliminated =
            result.eliminated;

        // La votazione ha prodotto un linciaggio.
        // Registriamo la morte per il Medium
        // e per il controllo del Cacciatore.
        this.deathRecords.push(
            new DeathRecord(
                eliminated,
                DeathCause.LYNCH,
                null
            )
        );

        // =====================================
        // CACCIATORE
        // =====================================

        if (
            eliminated.role.type ===
            RoleType.HUNTER
        ) {

            if (!hunterTarget) {
                throw new Error(
                    "Il Cacciatore è stato linciato: deve scegliere un bersaglio."
                );
            }

            HunterResolver.resolve(
                eliminated,
                hunterTarget,
                this.deathRecords,
                this.nightNumber
            );

            // HunterResolver ha creato una nuova morte.
            // La registriamo nella cronologia.
            this.deathRecords.push(
                new DeathRecord(
                    hunterTarget,
                    DeathCause.HUNTER,
                    this.nightNumber
                )
            );
        }

        // =====================================
        // CONTROLLO VITTORIA
        // =====================================

        this.checkVictory();

        if (
            this.winner === WinningTeam.NONE
        ) {
            this.phase =
                GamePhase.DAY;
        }

        return result;
    }

    public startNextNight(): void {

        if (this.phase === GamePhase.ENDED) {
            throw new Error(
                "La partita è terminata."
            );
        }

        if (this.phase !== GamePhase.DAY) {
            throw new Error(
                "La prossima notte può iniziare solo dopo il giorno."
            );
        }

        this.nightNumber++;

        this.phase =
            GamePhase.NIGHT;
    }

    public checkVictory(): WinningTeam {

        this.winner =
            WinCondition.check(
                this.players
            );

        if (
            this.winner !== WinningTeam.NONE
        ) {
            this.phase =
                GamePhase.ENDED;
        }

        return this.winner;
    }
}