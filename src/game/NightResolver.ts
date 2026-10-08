import { Player } from '../players/Player.js';
import { RoleType } from '../roles/Role.js';

import { NightAction, NightActionType } from './NightAction.js';

import { NightState } from './NightState.js';
import { AbilityValidator } from './AbilityValidator.js';
import { ActionResolver } from './ActionResolver.js';
import { RoleInspector } from './RoleInspector.js';
import { CopycatResolver } from './CopycatResolver.js';
import { WolfCubResolver } from './WolfCubResolver.js';
import { DeathRecord } from './DeathRecord.js';

export class NightResolver {
  public static resolve(
    actions: NightAction[],
    players: Player[],
    nightState: NightState,
    previousNightState: NightState | null = null,
    deathRecords: DeathRecord[] = []
  ): DeathRecord[] {
    const newDeaths: DeathRecord[] = [];

    // =====================================
    // 0. TRASFORMAZIONE CUCCIOLO DI LUPO
    // =====================================

    WolfCubResolver.awaken(players);

    // =====================================
    // REGISTRAZIONE DELLE AZIONI
    // =====================================

    for (const action of actions) {
      nightState.addAction(action);
    }

    // =====================================
    // 1. PUTTANA
    // =====================================

    const blockActions = actions.filter(
      (action) => action.type === NightActionType.PROSTITUTE_BLOCK
    );

    for (const action of blockActions) {
      if (AbilityValidator.canPerformAction(action, nightState)) {
        nightState.blockPlayer(action.target);

        console.log(`${action.target.name} è stato bloccato dalla Puttana.`);
      }
    }

    // =====================================
    // 2. GUARDIA DEL CORPO
    // =====================================

    const protectionActions = actions.filter(
      (action) => action.type === NightActionType.BODYGUARD_PROTECT
    );

    for (const action of protectionActions) {
      if (AbilityValidator.canPerformAction(action, nightState)) {
        nightState.protectPlayer(action.target);

        action.actor.lastProtectedPlayerId = action.target.id;

        console.log(`${action.actor.name} protegge ${action.target.name}.`);
      }
    }

    // =====================================
    // 3. VEGGENTE
    // =====================================

    const seerActions = actions.filter(
      (action) => action.type === NightActionType.SEER_CHECK
    );

    for (const action of seerActions) {
      if (AbilityValidator.canPerformAction(action, nightState)) {
        const isWerewolf = RoleInspector.isSeenAsWerewolfBySeer(action.target);

        nightState.seerResult = {
          target: action.target,
          isWerewolf,
        };

        console.log(
          `[Veggente] ${action.target.name}: ` +
            `${isWerewolf ? 'LUPO' : 'NON LUPO'}`
        );
      }
    }

    // =====================================
    // 4. MEDIUM
    // =====================================

    if (nightState.nightNumber >= 2) {
      const medium = players.find(
        (player) => player.role.type === RoleType.MEDIUM
      );

      if (medium && medium.isAlive && !nightState.isBlocked(medium)) {
        const previousDeath =
          deathRecords.length > 0
            ? deathRecords[deathRecords.length - 1]
            : undefined;

        if (previousDeath) {
          const result = RoleInspector.isTrueWerewolf(previousDeath.player)
            ? 'LUPO'
            : 'NON LUPO';

          console.log(`[Medium] ${previousDeath.player.name}: ${result}`);
        }
      }
    }

    // =====================================
    // 5. LUPI MANNARI
    // =====================================

    const wolfActions = actions.filter(
      (action) => action.type === NightActionType.WEREWOLF_KILL
    );

    const validWolfActions = wolfActions.filter((action) =>
      AbilityValidator.canPerformAction(action, nightState)
    );

    // Per ora il primo bersaglio valido
    // rappresenta la scelta dei Lupi.
    if (validWolfActions.length > 0) {
      nightState.werewolfTarget = validWolfActions[0].target;
    }

    // =====================================
    // 6. RISOLUZIONE ATTACCO DEI LUPI
    // =====================================

    if (nightState.werewolfTarget !== null && validWolfActions.length > 0) {
      const death = ActionResolver.resolveWerewolfKill(
        validWolfActions[0],
        nightState
      );

      if (death !== null) {
        newDeaths.push(death);
      }
    }

    // =====================================
    // 7. MITOMANE
    // =====================================

    if (nightState.nightNumber === 2) {
      const copyAction = actions.find(
        (action) => action.type === NightActionType.COPYCAT_COPY
      );

      if (
        copyAction &&
        AbilityValidator.canPerformAction(copyAction, nightState)
      ) {
        CopycatResolver.resolve(copyAction.actor, copyAction.target);
      }
    }

    // =====================================
    // FINE NOTTE
    // =====================================

    console.log(`FINE NOTTE ${nightState.nightNumber}`);

    return newDeaths;
  }
}
