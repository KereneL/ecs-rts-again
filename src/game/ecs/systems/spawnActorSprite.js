import * as bitEcs from 'bitecs';
import { BodyOrientation } from '../components/components';

export const spawnActorSpriteSystem = {
    init: function (world) {
        const { RendersSprite } = world.components
        bitEcs.observe(world, bitEcs.onSet(RendersSprite), (eid, params) => {
            if (params.tint) {
                RendersSprite.tint[eid] = params.tint
                RendersSprite.gameObject[eid].setTint(params.tint)
            }
        })
    },
    update: function (world) {

        const { RendersSprite, Transform, SpawningNow } = world.components
        const { scene } = world;

        for (const eid of bitEcs.query(world, [RendersSprite, Transform, SpawningNow])) {
            const { x, y } = Transform.centerPosition[eid];
            const key = RendersSprite.spriteKey[eid];
            const tint = RendersSprite.tint[eid];
            const scale = RendersSprite.scale[eid];
            const depth = RendersSprite.depth[eid];
            const angle = Phaser.Math.Angle.Normalize(BodyOrientation.angle[eid]);
            const framesFor360 = RendersSprite.framesFor360[eid]
            const quantizedAngle = Math.round((angle / Phaser.Math.PI2) * framesFor360)
            BodyOrientation.quantizedAngle[eid] = quantizedAngle;
            const frame = quantizedAngle % framesFor360

            const gO =
                scene.actorsPool.getFirstDead(true)
                    .setTexture(key)
                    .setFrame(frame)
                    .setPosition(x, y)
                    .setTint(tint)
                    .setScale(scale)
                    .setDepth(depth)
                    .setVisible(true)
                    .setActive(true)
            RendersSprite.gameObject[eid] = gO;

            bitEcs.removeComponent(world, eid, SpawningNow)
        }
    }
}