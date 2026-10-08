import { Role, RoleType, Team } from "./Role.js";

export class WolfCub extends Role {
    constructor() {
        super(
            "Cucciolo di Lupo",
            Team.VILLAGE,
            RoleType.WOLF_CUB
        );
    }
}