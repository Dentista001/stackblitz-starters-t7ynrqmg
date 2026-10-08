import { Player } from "../players/Player.js";

import { Villager } from "../roles/Villager.js";
import { Werewolf } from "../roles/Werewolf.js";
import { Seer } from "../roles/Seer.js";
import { Bodyguard } from "../roles/Bodyguard.js";
import { Prostitute } from "../roles/Prostitute.js";
import { Medium } from "../roles/Medium.js";
import { Hunter } from "../roles/Hunter.js";
import { Copycat } from "../roles/Copycat.js";
import { WolfCub } from "../roles/WolfCub.js";
import { Possessed } from "../roles/Possessed.js";

export class RoleAssigner {

    public static assignRoles(
        players: Player[]
    ): Player[] {

        const count = players.length;

        let roles = [];

        // =====================================
        // 4-5 GIOCATORI
        // =====================================

        if (count === 4) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Villager()
            ];

        } else if (count === 5) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Bodyguard(),
                new Villager()
            ];

        // =====================================
        // 6 GIOCATORI
        // =====================================

        } else if (count === 6) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Villager()
            ];

        // =====================================
        // 7 GIOCATORI
        // =====================================

        } else if (count === 7) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Medium(),
                new Villager()
            ];

        // =====================================
        // 8 GIOCATORI
        // =====================================

        } else if (count === 8) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Medium(),
                new Hunter(),
                new Villager()
            ];

        // =====================================
        // 9 GIOCATORI
        // =====================================

        } else if (count === 9) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Medium(),
                new Hunter(),
                new Copycat(),
                new Villager()
            ];

        // =====================================
        // 10 GIOCATORI
        // =====================================

        } else if (count === 10) {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new WolfCub(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Medium(),
                new Hunter(),
                new Copycat(),
                new Villager()
            ];

        // =====================================
        // 11+ GIOCATORI
        // =====================================

        } else {

            roles = [
                new Werewolf(),
                new Werewolf(),
                new WolfCub(),
                new Seer(),
                new Bodyguard(),
                new Prostitute(),
                new Medium(),
                new Hunter(),
                new Copycat(),
                new Possessed()
            ];

            while (roles.length < count) {
                roles.push(new Villager());
            }
        }

        // =====================================
        // MESCOLAMENTO
        // =====================================

        roles = [...roles].sort(
            () => Math.random() - 0.5
        );

        return players.map(
            (player, index) =>
                new Player(
                    player.id,
                    player.name,
                    roles[index]
                )
        );
    }
}