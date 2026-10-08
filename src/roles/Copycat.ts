import { Role, RoleType, Team } from "./Role.js";

export class Copycat extends Role {
    constructor() {
        super(
            "Mitomane",
            Team.VILLAGE,
            RoleType.COPYCAT
        );
    }
}