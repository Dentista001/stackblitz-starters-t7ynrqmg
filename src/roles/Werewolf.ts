import { Role, RoleType, Team } from "./Role.js";

export class Werewolf extends Role {
    constructor() {
        super(
            "Lupo Mannaro",
            Team.WEREWOLVES,
            RoleType.WEREWOLF
        );
    }
}