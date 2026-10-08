import { Role, RoleType, Team } from "./Role.js";

export class Villager extends Role {
    constructor() {
        super(
            "Contadino",
            Team.VILLAGE,
            RoleType.VILLAGER
        );
    }
}