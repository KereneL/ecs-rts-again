import * as bitEcs from 'bitecs';
import { engineAngleClass, PI } from '../utils';

export const updateSpriteRotationSystem = {
  // init: function (world) {},
  update: function (world) {
    const { RendersSprite, Transform, IsRotating, BodyOrientation } = world.components
    const PI2 = 2 * PI;

    for (const eid of bitEcs.query(world, [RendersSprite, Transform, IsRotating, BodyOrientation])) {
      const angle = engineAngleClass.Normalize(BodyOrientation.angle[eid]);
      const framesFor360 = RendersSprite.framesFor360[eid]
      const quantizedAngle = Math.round((angle / PI2) * framesFor360)
      BodyOrientation.quantizedAngle[eid] = quantizedAngle;
      const gO = RendersSprite.gameObject[eid];
      const frame = quantizedAngle % framesFor360
      
      gO.setFrame(frame)
    }

  }
}