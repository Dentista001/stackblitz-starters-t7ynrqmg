import { Player } from '../players/Player.js';
import { RoleType } from '../roles/Role.js';

export class RoleInspector {
  public static isTrueWerewolf(player: Player): boolean {
    switch (player.role.type) {
      case RoleType.WEREWOLF:
        return true;

      default:
        return false;
    }
  }

  public static isWolfTeam(player: Player): boolean {
    if (player.role.type === RoleType.WEREWOLF) {
      return true;
    }

    if (player.role.type === RoleType.POSSESSED) {
      return true;
    }

    return false;
  }

  public static isSeenAsWerewolfBySeer(player: Player): boolean {
    return this.isTrueWerewolf(player);
  }
}
