import * as bitEcs from 'bitecs';

export const followEntitySystem = {
    // init: function (world) {},
    update: function (world) {
        const { RendersSprite, Transform, FollowEntity } = world.components

        for (const eid of bitEcs.query(world, [RendersSprite, Transform, FollowEntity])) {
            const entityFollowedId = FollowEntity.eid[eid];
            const offsetVector = FollowEntity.offset[eid];

            const depth = RendersSprite.depth[entityFollowedId] + FollowEntity.depthOffset[eid]
            Transform.centerPosition[eid] = Transform.centerPosition[entityFollowedId].clone().add(offsetVector)
            RendersSprite.depth[eid] = depth
        }
    }
}