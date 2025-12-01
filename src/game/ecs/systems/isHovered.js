import * as bitEcs from 'bitecs';

export const isHoveredSystem = {
    init: function (world) {
        const { IsHovered, IsSelected, Selectable, RendersSprite } = world.components
        this.selectorPrefix = 'selection-mark-';

        bitEcs.observe(world, bitEcs.onRemove(IsHovered), (eid) => {
            const isSelected = bitEcs.hasComponent(world, eid, IsSelected)
            const selectorEid = Selectable.selectorEid[eid];
            const selectorGameObject = RendersSprite.gameObject[selectorEid]

            if (!isSelected) {
                world.scene.actorsPool.killAndHide(selectorGameObject)
                bitEcs.removeEntity(world, selectorEid)
                Selectable.selectorEid[eid] = null;
            }
        })
    },
    update: function (world) {
        const { Transform, Selectable, IsHovered, RendersSprite, SpawningNow, FollowEntity } = world.components
        for (const eid of bitEcs.query(world, [Selectable, IsHovered])) {
            if (!Selectable.selectorEid[eid]) {
                const key = this.selectorPrefix + Selectable.selectionMarkerSize[eid]

                const selectorEntity = bitEcs.addEntity(world)
                Selectable.selectorEid[eid] = selectorEntity

                bitEcs.addComponent(world, selectorEntity, RendersSprite)
                RendersSprite.spriteKey[selectorEntity] = key
                RendersSprite.tint[selectorEntity] = 0xffffff
                RendersSprite.scale[selectorEntity] = RendersSprite.scale[eid]

                bitEcs.addComponent(world, selectorEntity, Transform)
                Transform.centerPosition[selectorEntity] = Transform.centerPosition[eid]

                bitEcs.addComponent(world, selectorEntity, FollowEntity)
                FollowEntity.eid[selectorEntity] = eid
                FollowEntity.offset[selectorEntity] = { x: 0, y: 0 }
                FollowEntity.depthOffset[selectorEntity] = -0.1,

                    bitEcs.addComponent(world, selectorEntity, SpawningNow)
            } else {
                const selectorEntity = Selectable.selectorEid[eid];
                bitEcs.setComponent(world, selectorEntity, RendersSprite, { tint: 0xffffff })
            }
        }
    }
}