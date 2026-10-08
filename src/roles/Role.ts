export enum Team {
  VILLAGE = "VILLAGE",
  WEREWOLVES = "WEREWOLVES"
}

export enum RoleType {
  VILLAGER = "VILLAGER",
  WEREWOLF = "WEREWOLF",
  PROSTITUTE = "PROSTITUTE",
  BODYGUARD = "BODYGUARD",
  SEER = "SEER",
  HUNTER = "HUNTER",
  COPYCAT = "COPYCAT",
  MEDIUM = "MEDIUM",
  WOLF_CUB = "WOLF_CUB",
  POSSESSED = "POSSESSED"
}

export abstract class Role {
  public readonly name: string;
  public readonly team: Team;
  public readonly type: RoleType;

  protected constructor(
      name: string,
      team: Team,
      type: RoleType
  ) {
      this.name = name;
      this.team = team;
      this.type = type;
  }
}