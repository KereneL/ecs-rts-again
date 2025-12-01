import * as bitEcs from 'bitecs';
import { engineCircleType, engineDistanceClass, engineRectType } from '../utils';

export const interpretInputSystem = {
    init: function (world) {
        this.circleVar = new engineCircleType();
        this.rectVar = new engineRectType();
        this.minimalDistance = 16;

        this.boxSelectRect = world.scene.boxSelectRect;
    },
    update: function (world) {
        const { InputState, Interactable, Transform, IsHovered, IsSelected } = world.components
        const { playerEid } = world.scene
        const mouseWPosition = InputState.mouseWPosition[playerEid];
        const downPosition = InputState.downPosition[playerEid];

        const mouseLeftDown = InputState.mouseLeftDown[playerEid];
        const mouseLeftJustUp = InputState.mouseLeftJustUp[playerEid];
        const isCtrlDown = InputState.keyboardCtrlDown[playerEid];

        let rect;

        if (mouseLeftDown) {
            if (!InputState.isDragging[playerEid]) {
                const d = engineDistanceClass.BetweenPoints(mouseWPosition, downPosition)
                if (
                    d &&
                    d >= this.minimalDistance
                ) {
                    InputState.isDragging[playerEid] = true;
                }
            }
        }
        if (InputState.isDragging[playerEid]) {
            rect = this.getRect(mouseWPosition, downPosition)
            this.boxSelectRect.setPosition(rect.x, rect.y).setSize(rect.width, rect.height).setVisible(true)
        }

        let entitiesSelected = [];
        for (const eid of bitEcs.query(world, [Interactable, Transform])) {
            if (!InputState.isDragging[playerEid]) {
                const doesIntrsctPoint = this.intersectPoint(world, eid, mouseWPosition.x, mouseWPosition.y);
                if (doesIntrsctPoint) {
                    entitiesSelected.push(eid)
                } else {
                    bitEcs.removeComponent(world, eid, IsHovered)
                }
            } else {
                if (this.intersectRect(world, eid, rect.x, rect.y, rect.width, rect.height)) {
                    entitiesSelected.push(eid)
                } else {
                    bitEcs.removeComponent(world, eid, IsHovered)
                }
            }
        }

        // If Left Click just released
        if (mouseLeftJustUp) {
            InputState.isDragging[playerEid] = false;
            InputState.downPosition[playerEid] = null;
            this.boxSelectRect.setPosition(0).setSize(0).setVisible(false)

            // If Ctrl isn't down - reset selection before new selection
            if (!isCtrlDown) {
                this.deselectAll(world)
            }
            if (entitiesSelected.length == 0) return;
            for (const eid of entitiesSelected) {
                bitEcs.addComponent(world, eid, IsSelected)
            }
        } else {
            for (const eid of entitiesSelected) {
                bitEcs.addComponent(world, eid, IsHovered)
            }
        }
    },

    getRect: function (mouseWPosition, downPosition) {
        const x1 = Math.min(mouseWPosition.x, downPosition.x)
        const y1 = Math.min(mouseWPosition.y, downPosition.y)
        const x2 = Math.max(mouseWPosition.x, downPosition.x)
        const y2 = Math.max(mouseWPosition.y, downPosition.y)
        return engineRectType.FromXY(x1, y1, x2, y2)
    },
    intersectRect: function (world, eid, rectX, rectY, rectWidth, rectHeight) {
        const { Transform, Interactable } = world.components
        const { x, y } = Transform.centerPosition[eid]
        this.rectVar.setTo(rectX, rectY, rectWidth, rectHeight);
        const doesContain = (
            bitEcs.hasComponent(world, eid, Interactable) &&
            this.rectVar &&
            this.rectVar.contains(x, y)
        )
        return doesContain
    },
    intersectPoint: function (world, eid, pointX, pointY) {
        const { Transform, Interactable } = world.components
        const { x, y } = Transform.centerPosition[eid]
        let hitBoxGeom;

        if (
            Interactable.hitAreaType[eid] == 'circle'
        ) {
            const radius = Interactable.hitAreaRadius[eid];
            this.circleVar.setTo(x, y, radius);
            hitBoxGeom = this.circleVar;
        } else if (
            Interactable.hitAreaType[eid] == 'rect'
        ) {
            const width = Interactable.hitAreaWidth[eid];
            const height = Interactable.hitAreaHeight[eid];
            this.rectVar.setTo(x, y, width, height);
            hitBoxGeom = this.rectVar;
        };
        const doesContain = (
            hitBoxGeom &&
            hitBoxGeom.contains(pointX, pointY)
        )
        return doesContain
    },
    deselectAll: function (world) {
        const { Selectable, IsSelected } = world.components
        for (const eid of bitEcs.query(world, [Selectable, IsSelected])) {
            bitEcs.removeComponent(world, eid, IsSelected)
        }
    },
}
