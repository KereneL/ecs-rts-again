import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

export const updateSpriteRotationSystem = {
  // init: function (world) {},
  update: function (world) {
    const { RendersSprite, Transform, IsMoving, BodyOrientation } = world.components
    for (const eid of bitEcs.query(world, [RendersSprite, Transform, IsMoving, BodyOrientation])) {
      const angle = Phaser.Math.Angle.Normalize(BodyOrientation.angle[eid]);
      const framesFor360 = RendersSprite.framesFor360[eid]
      const quantizedAngle = Math.round((angle / Phaser.Math.PI2) * framesFor360)
      BodyOrientation.quantizedAngle[eid] = quantizedAngle;
      const gO = RendersSprite.gameObject[eid];
      const frame = quantizedAngle % framesFor360
      gO.setFrame(frame)
    }

  }
}