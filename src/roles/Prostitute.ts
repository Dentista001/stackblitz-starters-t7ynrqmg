import { Role, RoleType, Team } from "./Role.js";

export class Prostitute extends Role {
    constructor() {
        super(
            "Puttana",
            Team.VILLAGE,
            RoleType.PROSTITUTE
        );
    }
}