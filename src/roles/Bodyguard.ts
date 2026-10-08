import { Role, RoleType, Team } from "./Role.js";

export class Bodyguard extends Role {
    constructor() {
        super(
            "Guardia del Corpo",
            Team.VILLAGE,
            RoleType.BODYGUARD
        );
    }
}