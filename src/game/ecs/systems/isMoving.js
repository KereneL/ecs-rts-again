import * as bitEcs from 'bitecs';
import { engineAngleClass, engineVector2Type, engineDistanceClass } from '../utils';

export const isMovingSystem = {
  // init: function (world) {},
  update: function (world) {
    const { Transform, BodyOrientation, Mobile, IsMoving, IsRotating, IsTraversing } = world.components
    const deltaTimeInSeconds = world.time.deltaInSeconds;

    for (const eid of bitEcs.query(world, [Transform, BodyOrientation, Mobile, IsMoving])) {
      const actorPosition = Transform.centerPosition[eid]
      const currentAngle = BodyOrientation.angle[eid];
      const targetPosition = IsMoving.target[eid]
      const angleToTarget = engineAngleClass.BetweenPoints(actorPosition, targetPosition);
      if (IsMoving.justStartedMovement[eid]) {
        if (currentAngle != angleToTarget) {
          bitEcs.addComponent(world, eid, IsRotating)
        } else {
          bitEcs.removeComponent(world, eid, IsRotating)
          bitEcs.addComponent(world, eid, IsTraversing)
        }
      }

      if (bitEcs.hasComponent(world, eid, IsRotating)) {
        if (currentAngle == angleToTarget) {
          bitEcs.removeComponent(world, eid, IsRotating)
          bitEcs.addComponent(world, eid, IsTraversing)
        } else {
          const turnAmount = Mobile.turnSpeed[eid] * deltaTimeInSeconds;
          const doesTurnInPlace = Mobile.turnsInPlace[eid];
          const rotationToDirection = engineAngleClass.RotateTo(currentAngle, angleToTarget, turnAmount);
          BodyOrientation.angle[eid] = + rotationToDirection;
          if (doesTurnInPlace) {
            bitEcs.removeComponent(world, eid, IsTraversing)
          }
        }
      }
      if (bitEcs.hasComponent(world, eid, IsTraversing)) {
        const traverseAmount = Mobile.speed[eid] * deltaTimeInSeconds;
        const traversingVec2 = new engineVector2Type().setToPolar(currentAngle, traverseAmount);
        Transform.centerPosition[eid].add(traversingVec2);

        if (engineDistanceClass.BetweenPoints(actorPosition, targetPosition) < traverseAmount) {
          IsMoving.target[eid] = null;
          bitEcs.removeComponent(world, eid, IsTraversing)
          bitEcs.removeComponent(world, eid, IsRotating)
          bitEcs.removeComponent(world, eid, IsMoving)
        }
      }
    }
  },
}