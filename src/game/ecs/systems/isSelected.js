import * as bitEcs from 'bitecs';

export const isSelectedSystem = {
    init: function (world) {
        const { IsSelected, Selectable, RendersSprite } = world.components
        bitEcs.observe(world, bitEcs.onRemove(IsSelected), (eid) => {
            const selectorEid = Selectable.selectorEid[eid];
            const selectorGameObject = RendersSprite.gameObject[selectorEid]
            world.scene.actorsPool.killAndHide(selectorGameObject)
            bitEcs.removeEntity(world, selectorEid)
            Selectable.selectorEid[eid] = null;
        })
    },
    update: function (world) {
        const { Transform, Selectable, IsSelected, RendersSprite, SpawningNow, FollowEntity } = world.components

        for (const eid of bitEcs.query(world, [Selectable, IsSelected])) {
            if (!Selectable.selectorEid[eid]) {
                const key = 'selection-mark-' + Selectable.selectionMarkerSize[eid]
                // const { x, y, depth, scale } = RendersSprite.gameObject[eid]

                const selectorEntity = bitEcs.addEntity(world)
                Selectable.selectorEid[eid] = selectorEntity

                bitEcs.addComponent(world, selectorEntity, RendersSprite)
                RendersSprite.spriteKey[selectorEntity] = key
                RendersSprite.tint[selectorEntity] = 0x00ff00
                RendersSprite.scale[selectorEntity] = RendersSprite.scale[eid]

                bitEcs.addComponent(world, selectorEntity, Transform)
                Transform.centerPosition[selectorEntity] = Transform.centerPosition[eid]

                bitEcs.addComponent(world, selectorEntity, FollowEntity)
                FollowEntity.eid[selectorEntity] = eid
                FollowEntity.offset[selectorEntity] = { x: 0, y: 0 }
                FollowEntity.depthOffset[selectorEntity] = -0.1;

                bitEcs.addComponent(world, selectorEntity, SpawningNow)
            } else {
                const selectorEntity = Selectable.selectorEid[eid];
                bitEcs.setComponent(world, selectorEntity, RendersSprite, { tint: 0x00ff00 })
            }
        }
    }
}