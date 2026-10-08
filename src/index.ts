import { Player } from "./players/Player.js";
import { RoleType } from "./roles/Role.js";
import { Villager } from "./roles/Villager.js";
import { WinningTeam } from "./game/WinCondition.js";
import { Game, GamePhase } from "./game/Game.js";

import {
    NightAction,
    NightActionType
} from "./game/NightAction.js";

import { Vote } from "./game/Vote.js";

console.log("====================================");
console.log("     TEST COMPLETO DELLA PARTITA");
console.log("====================================");

// =====================================
// GIOCATORI
// =====================================

const players = [
    new Player("1", "Marco", new Villager()),
    new Player("2", "Luca", new Villager()),
    new Player("3", "Andrea", new Villager()),
    new Player("4", "Matteo", new Villager()),
    new Player("5", "Davide", new Villager()),
    new Player("6", "Franco", new Villager())
];

// =====================================
// CREAZIONE PARTITA
// =====================================

const game = new Game("test");

for (const player of players) {
    game.addPlayer(player);
}

game.startGame();

console.log("\nPARTITA AVVIATA");
console.log("Fase:", game.phase);
console.log("Notte:", game.nightNumber);

// =====================================
// RUOLI
// =====================================

console.log("\nRUOLI:");

for (const player of game.players) {
    console.log(
        `${player.name}: ${player.role.name}`
    );
}

// =====================================
// CICLO COMPLETO DELLA PARTITA
// =====================================

while (game.phase !== GamePhase.ENDED) {

    // =================================
    // NOTTE
    // =================================

    if (game.phase === GamePhase.NIGHT) {

        console.log("\n====================================");
        console.log(`              NOTTE ${game.nightNumber}`);
        console.log("====================================");

        const livingPlayers =
            game.players.filter(
                player => player.isAlive
            );

        const wolves =
            livingPlayers.filter(
                player =>
                    player.role.type === RoleType.WEREWOLF
            );

        const seer =
            livingPlayers.find(
                player =>
                    player.role.type === RoleType.SEER
            );

        const guard =
            livingPlayers.find(
                player =>
                    player.role.type === RoleType.BODYGUARD
            );

        const prostitute =
            livingPlayers.find(
                player =>
                    player.role.type === RoleType.PROSTITUTE
            );

        // Bersaglio vivo non appartenente ai Lupi.
        const wolfTarget =
            livingPlayers.find(
                player =>
                    player.role.team !==
                    game.players.find(
                        p =>
                            p.role.type === RoleType.WEREWOLF
                    )?.role.team
            );

        const nightActions: NightAction[] = [];

        // =================================
        // LUPI
        // =================================

        if (
            wolves.length > 0 &&
            wolfTarget
        ) {

            for (const wolf of wolves) {

                if (wolfTarget.id !== wolf.id) {

                    nightActions.push(
                        new NightAction(
                            NightActionType.WEREWOLF_KILL,
                            wolf,
                            wolfTarget
                        )
                    );
                }
            }
        }

        // =================================
        // GUARDIA
        // =================================

        if (
            guard &&
            wolfTarget
        ) {

            // Evitiamo di proteggere lo stesso
            // giocatore per due notti consecutive.
            const guardTarget =
                livingPlayers.find(
                    player =>
                        player.id !==
                        guard.lastProtectedPlayerId
                );

            if (guardTarget) {

                nightActions.push(
                    new NightAction(
                        NightActionType.BODYGUARD_PROTECT,
                        guard,
                        guardTarget
                    )
                );
            }
        }

        // =================================
        // PUTTANA
        // =================================

        if (
            prostitute &&
            wolfTarget &&
            prostitute.id !== wolfTarget.id
        ) {

            nightActions.push(
                new NightAction(
                    NightActionType.PROSTITUTE_BLOCK,
                    prostitute,
                    wolfTarget
                )
            );
        }

        // =================================
        // VEGGENTE
        // =================================

        if (seer && wolves.length > 0) {

            const seerTarget =
                wolves.find(
                    wolf =>
                        wolf.id !== seer.id
                );

            if (seerTarget) {

                nightActions.push(
                    new NightAction(
                        NightActionType.SEER_CHECK,
                        seer,
                        seerTarget
                    )
                );
            }
        }

        // =================================
        // RISOLUZIONE NOTTE
        // =================================

        const nightState =
            game.resolveNight(
                nightActions
            );

        console.log(
            "Bersaglio dei Lupi:",
            nightState.werewolfTarget?.name ??
            "nessuno"
        );

        console.log(
            "Fase:",
            game.phase
        );
          if (game.winner !== WinningTeam.NONE) {
          break;
      }
    }

    // =====================================
    // GIORNO
    // =====================================

    if (game.phase === GamePhase.DAY) {

        console.log("\nÈ GIORNO.");

        game.startVoting();

        console.log(
            "VOTAZIONE AVVIATA."
        );
    }

    // =====================================
    // VOTAZIONE
    // =====================================

    if (game.phase === GamePhase.VOTING) {

        const livingPlayers =
            game.players.filter(
                player => player.isAlive
            );

        if (livingPlayers.length <= 1) {
            game.checkVictory();
            break;
        }

        const votes: Vote[] = [];

        // =================================
        // TEST AUTOMATICO DEI VOTI
        // =================================

        for (let i = 0; i < livingPlayers.length; i++) {

            const voter =
                livingPlayers[i];

            // Ogni giocatore vota il primo
            // giocatore vivo diverso da sé.
            const target =
                livingPlayers.find(
                    player =>
                        player.id !== voter.id
                );

            if (!target) {
                continue;
            }

            votes.push(
                new Vote(
                    voter,
                    target
                )
            );
        }

        const voteResult =
            game.resolveVoting(
                votes
            );

        console.log(
            "\nRISULTATO VOTAZIONE:"
        );

        if (voteResult.eliminated) {

            console.log(
                "Eliminato:",
                voteResult.eliminated.name,
                "-",
                voteResult.eliminated.role.name
            );

        } else if (voteResult.isTie()) {

            console.log(
                "Pareggio tra:",
                voteResult.tiedPlayers
                    .map(
                        player =>
                            player.name
                    )
                    .join(", ")
            );

        } else {

            console.log(
                "Nessun eliminato."
            );
        }

        // =================================
        // VITTORIA
        // =================================

        console.log(
            "VINCITORE:",
            game.winner
        );

        if (game.winner !== WinningTeam.NONE) {
          break;
      }

        // =================================
        // NUOVA NOTTE
        // =================================

        game.startNextNight();

        console.log(
            "\nNUOVA NOTTE AVVIATA:",
            game.nightNumber
        );
    }
}

// =====================================
// FINE PARTITA
// =====================================

console.log("\n====================================");
console.log("          PARTITA TERMINATA");
console.log("====================================");

console.log(
    "Vincitore:",
    game.winner
);

console.log(
    "Notti giocate:",
    game.nightNumber
);

console.log("\nSTATO FINALE:");

for (const player of game.players) {

    console.log(
        `${player.name}: ` +
        `${player.role.name} - ` +
        `${player.isAlive ? "VIVO" : "MORTO"}`
    );
}

console.log("\n====================================");
console.log("       TEST COMPLETATO");
console.log("====================================");