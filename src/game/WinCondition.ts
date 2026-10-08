import { Player } from "../players/Player.js";
import { RoleInspector } from "./RoleInspector.js";

export enum WinningTeam {
    NONE = "NONE",
    VILLAGE = "VILLAGE",
    WEREWOLVES = "WEREWOLVES"
}

export class WinCondition {

    public static check(
        players: Player[]
    ): WinningTeam {

        const livingPlayers =
            players.filter(
                player => player.isAlive
            );

        // =====================================
        // LUPI VERI
        // =====================================

        const livingTrueWolves =
            livingPlayers.filter(
                player =>
                    RoleInspector.isTrueWerewolf(player)
            );

        // =====================================
        // CUCCIOLO IN ATTESA DI TRASFORMAZIONE
        // =====================================

        const pendingWolfCub =
            livingPlayers.some(
                player =>
                    player.wolfCubAwakeningPending
            );

        // Se non esistono Lupi veri e non c'è
        // un Cucciolo destinato a trasformarsi,
        // vince il Villaggio.
        if (
            livingTrueWolves.length === 0 &&
            !pendingWolfCub
        ) {
            return WinningTeam.VILLAGE;
        }

        // =====================================
        // SQUADRA DEI LUPI
        // =====================================

        const livingWolfTeam =
            livingPlayers.filter(
                player =>
                    RoleInspector.isWolfTeam(player)
            );

        // =====================================
        // NON SQUADRA DEI LUPI
        // =====================================

        const livingNonWolfTeam =
            livingPlayers.filter(
                player =>
                    !RoleInspector.isWolfTeam(player)
            );

        // I Lupi vincono quando sono in parità
        // o maggioranza rispetto agli altri vivi.
        if (
            livingWolfTeam.length >=
            livingNonWolfTeam.length
        ) {
            return WinningTeam.WEREWOLVES;
        }

        return WinningTeam.NONE;
    }
}