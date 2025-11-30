import * as bitEcs from 'bitecs';
import { engineVector2Type } from '../utils';

export const orderedMoveSystem = {
  // init: function (world) {},
  update: function (world) {
    const { IsMoving, OrderedMove, IsRotating, IsTraversing } = world.components
    for (const eid of bitEcs.query(world, [OrderedMove])) {
      bitEcs.addComponent(world, eid, IsMoving)
      IsMoving.justStartedMovement[eid] = true;
      IsMoving.target[eid] = new engineVector2Type(OrderedMove.target[eid])
      bitEcs.removeComponent(world, eid, OrderedMove)
    }
  }
}