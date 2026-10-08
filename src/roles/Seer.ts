import { Role, RoleType, Team } from "./Role.js";

export class Seer extends Role {
    constructor() {
        super(
            "Veggente",
            Team.VILLAGE,
            RoleType.SEER
        );
    }
}