import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

const circleVar = new Phaser.Geom.Circle();
const rectVar = new Phaser.Geom.Rectangle();
const minimalDistance = 16;

export const interpretInputSystem = {
    init: function (world) {
        this.boxSelectRect = world.scene.boxSelectRect;
    },
    update: function (world) {
        const { InputState, Interactable, Transform, IsHovered, IsSelected } = world.components
        const { playerEid } = world.scene
        const mousePosition = InputState.mousePosition[playerEid];
        const downPosition = InputState.downPosition[playerEid];

        const mouseLeftDown = InputState.mouseLeftDown[playerEid];
        const mouseLeftJustUp = InputState.mouseLeftJustUp[playerEid];
        const isCtrlDown = InputState.keyboardCtrlDown[playerEid];
        let rect;

        if (mouseLeftDown) {
            if (!InputState.isDragging[playerEid]) {
                const d = Phaser.Math.Distance.BetweenPoints(mousePosition, downPosition)
                if (d && d >= minimalDistance) {
                    InputState.isDragging[playerEid] = true;
                }
            }
        }
        if (InputState.isDragging[playerEid]) {
            rect = getRect(mousePosition, downPosition)
            this.boxSelectRect.setPosition(rect.x, rect.y).setSize(rect.width, rect.height).setVisible(true)
        }

        let entitiesSelected = [];
        for (const eid of bitEcs.query(world, [Interactable, Transform])) {
            if (!InputState.isDragging[playerEid]) {
                const doesIntrsctPoint = intersectPoint(world, eid, mousePosition.x, mousePosition.y);
                if (doesIntrsctPoint) {
                    entitiesSelected.push(eid)
                } else {
                    bitEcs.removeComponent(world, eid, IsHovered)
                }
            } else {
                if (intersectRect(world, eid, rect.x, rect.y, rect.width, rect.height)) {
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
                deselectAll(world)
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
    }
}

function getRect(mousePosition, downPosition) {
    const x1 = Math.min(mousePosition.x, downPosition.x)
    const y1 = Math.min(mousePosition.y, downPosition.y)
    const x2 = Math.max(mousePosition.x, downPosition.x)
    const y2 = Math.max(mousePosition.y, downPosition.y)
    return Phaser.Geom.Rectangle.FromXY(x1, y1, x2, y2)
}
function intersectRect(world, eid, rectX, rectY, rectWidth, rectHeight) {
    const { Transform, Interactable } = world.components
    const { x, y } = Transform.centerPosition[eid]
    rectVar.setTo(rectX, rectY, rectWidth, rectHeight);
    const doesContain = (bitEcs.hasComponent(world, eid, Interactable) && rectVar && rectVar.contains(x, y))
    return doesContain
}
function intersectPoint(world, eid, pointX, pointY) {
    const { Transform, Interactable } = world.components
    const { x, y } = Transform.centerPosition[eid]
    let hitBoxGeom;

    if (Interactable.hitAreaType[eid] == 'circle') {
        const radius = Interactable.hitAreaRadius[eid];
        circleVar.setTo(x, y, radius);
        hitBoxGeom = circleVar;
    } else if (Interactable.hitAreaType[eid] == 'rect') {
        const width = Interactable.hitAreaWidth[eid];
        const height = Interactable.hitAreaHeight[eid];
        rectVar.setTo(x, y, width, height);
        hitBoxGeom = rectVar;
    };
    const doesContain = (hitBoxGeom && hitBoxGeom.contains(pointX, pointY))
    return doesContain
}
function deselectAll(world) {
    const { Selectable, IsSelected } = world.components
    for (const eid of bitEcs.query(world, [Selectable, IsSelected])) {
        bitEcs.removeComponent(world, eid, IsSelected)
    }
}