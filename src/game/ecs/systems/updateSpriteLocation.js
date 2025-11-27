import * as bitEcs from 'bitecs';

export const updateSpriteLocationSystem = {
  // init: function (world) {},
  update: function (world) {
    const { RendersSprite, Transform, IsMoving, FollowEntity } = world.components

    for (const eid of bitEcs.query(world, [RendersSprite, Transform, bitEcs.Any(IsMoving, FollowEntity)])) {
      const { x, y } = Transform.centerPosition[eid];
      const gO = RendersSprite.gameObject[eid];
      gO?.setPosition(x, y)
    }
  }
}