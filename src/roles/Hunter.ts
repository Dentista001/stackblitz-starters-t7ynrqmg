import { Role, RoleType, Team } from "./Role.js";

export class Hunter extends Role {
    constructor() {
        super(
            "Cacciatore",
            Team.VILLAGE,
            RoleType.HUNTER
        );
    }
}