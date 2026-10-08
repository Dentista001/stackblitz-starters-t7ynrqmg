import { Role, RoleType, Team } from "./Role.js";

export class Medium extends Role {
    constructor() {
        super(
            "Medium",
            Team.VILLAGE,
            RoleType.MEDIUM
        );
    }
}