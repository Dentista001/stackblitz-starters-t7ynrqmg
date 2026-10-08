import { Player } from '../players/Player.js';
import { RoleType } from '../roles/Role.js';
import { Werewolf } from '../roles/Werewolf.js';
import { Seer } from '../roles/Seer.js';

export class CopycatResolver {
  public static resolve(actor: Player, target: Player): void {
    if (actor.role.type !== RoleType.COPYCAT) {
      throw new Error('Solo il Mitomane può utilizzare questa abilità.');
    }

    if (actor.copycatUsed) {
      throw new Error('Il Mitomane ha già utilizzato la sua abilità.');
    }

    actor.copycatUsed = true;

    if (target.role.type === RoleType.WEREWOLF) {
      actor.role = new Werewolf();

      console.log(`${actor.name} ha copiato il ruolo del Lupo Mannaro.`);

      return;
    }

    if (target.role.type === RoleType.SEER) {
      actor.role = new Seer();

      console.log(`${actor.name} ha copiato il ruolo della Veggente.`);

      return;
    }

    console.log(
      `${actor.name} ha scelto ${target.name}, ` + `ma rimane Mitomane.`
    );
  }
}
