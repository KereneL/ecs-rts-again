import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

export const updateSpriteRotationSystem = {
  // init: function (world) {},
  update: function (world) {
    const { RendersSprite, Transform, IsMoving, BodyOrientation } = world.components
    for (const eid of bitEcs.query(world, [RendersSprite, Transform, IsMoving, BodyOrientation])) {
      const angle = Phaser.Math.Angle.Normalize(BodyOrientation.angle[eid]);
      const quantizedAngle = Math.round((angle / Phaser.Math.PI2) * 8)
      BodyOrientation.quantizedAngle[eid] = quantizedAngle;
      const gO = RendersSprite.gameObject[eid];
      const frame = quantizedAngle % 8
      gO.setFrame(frame)
    }

  }
}