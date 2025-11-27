import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

export const orderedMoveSystem = {
  // init: function (world) {},
  update: function (world) {
    const { IsMoving, OrderedMove } = world.components
    for (const eid of bitEcs.query(world, [OrderedMove])) {
      bitEcs.addComponent(world, eid, IsMoving)
      IsMoving.target[eid] = new Phaser.Math.Vector2(OrderedMove.target[eid])
      IsMoving.isRotating[eid] = true
      IsMoving.isTraversing[eid] = false
      bitEcs.removeComponent(world, eid, OrderedMove)
    }
  }
}