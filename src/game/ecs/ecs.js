import * as bitEcs from "bitecs";
import * as components from './components/components';
import { timeSystem } from "./systems/time";
import { isMovingSystem } from "./systems/isMoving";
import { updateSpriteRotationSystem } from "./systems/updateSpriteRotation";
import { updateSpriteLocationSystem } from "./systems/updateSpriteLocation";
import { spawnActorSpriteSystem } from "./systems/spawnActorSprite";
import { orderedMoveSystem } from "./systems/orderedMove";
import { isSelectedSystem } from "./systems/isSelected";
import { followEntitySystem } from "./systems/followEntity";
import { getInputSystem } from "./systems/getInput";
import { selectableSystem } from "./systems/selectable";
import { isHoveredSystem } from "./systems/isHovered";
import { interpretInputSystem } from "./systems/interpretInput";

const systemsObjs =
  [
    spawnActorSpriteSystem,
    getInputSystem,
    interpretInputSystem,
    selectableSystem,
    isSelectedSystem,
    isHoveredSystem,
    orderedMoveSystem,
    isMovingSystem,
    followEntitySystem,
    updateSpriteRotationSystem,
    updateSpriteLocationSystem,
  ]

export function createGameWorld(scene) {
  const world = bitEcs.createWorld({
    components,
    time: {
      delta: 0,
      deltaInSeconds: 0,
      elapsed: 0,
      then: 0
    },
    scene,
    initSystems: function () {
      for (const system of systemsObjs) {
        system?.init?.(this)
      }
    },
    updateWorld: function (deltaTime) {
      timeSystem.update(this, deltaTime);
      for (const system of systemsObjs) {
        system?.update?.(this)
      }
    }
  });

  return world;
}