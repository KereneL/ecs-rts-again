import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

export const isMovingSystem = {
  // init: function (world) {},
  update: function (world) {
    const { Transform, BodyOrientation, Mobile, IsMoving } = world.components
    const deltaTimeInSeconds = world.time.deltaInSeconds;

    for (const eid of bitEcs.query(world, [Transform, BodyOrientation, Mobile, IsMoving])) {
      if (IsMoving.isRotating[eid]) {
        const actorPosition = Transform.centerPosition[eid]
        const targetPosition = IsMoving.target[eid]
        const angleToTarget = Phaser.Math.Angle.BetweenPoints(actorPosition, targetPosition);

        if (BodyOrientation.angle[eid] != angleToTarget) {
          const currentAngle = BodyOrientation.angle[eid]
          const turnAmount = Mobile.turnSpeed[eid] * deltaTimeInSeconds;
          const rotationToDirection = Phaser.Math.Angle.RotateTo(currentAngle, angleToTarget, turnAmount);
          BodyOrientation.angle[eid] = + rotationToDirection;
          if (!Mobile.turnsInPlace[eid]) {
            IsMoving.isTraversing[eid] = true
          }
        } else {
          IsMoving.isRotating[eid] = false
          IsMoving.isTraversing[eid] = true
        }
      }
      if (IsMoving.isTraversing[eid]) {
        const traverseAngle = BodyOrientation.angle[eid]
        const traverseAmount = Mobile.speed[eid] * deltaTimeInSeconds;
        const traversingVec2 = new Phaser.Math.Vector2().setToPolar(traverseAngle, traverseAmount);
        Transform.centerPosition[eid].add(traversingVec2);
      }
    }
  }
}