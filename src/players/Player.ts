import { Role } from "../roles/Role.js";
import { Villager } from "../roles/Villager.js";

export class Player {
    public readonly id: string;
    public readonly name: string;

    public role: Role;
    public isAlive: boolean = true;

    public lastProtectedPlayerId: string | null = null;
    public copycatUsed: boolean = false;
    public wolfCubAwakeningPending: boolean = false;

    constructor(
        id: string,
        name: string,
        role: Role = new Villager()
    ) {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}