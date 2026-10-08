import { Role, RoleType, Team } from "./Role.js";

export class Possessed extends Role {
    constructor() {
        super(
            "Indemoniato",
            Team.WEREWOLVES,
            RoleType.POSSESSED
        );
    }
}