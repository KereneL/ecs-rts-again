import * as bitEcs from 'bitecs';

export const getInputSystem = {
    // init: function (world) { },
    update: function (world) {
        const { InputState } = world.components
        const { scene } = world;
        const { playerEid, keyboardKeys } = scene;
        const { mousePointer } = scene.input
        const { worldX: mouseWorldX, worldY: mouseWorldY } = mousePointer

        const isLeftButtonDown = mousePointer.leftButtonDown()
        const isRightButtonDown = mousePointer.rightButtonDown()
        const isCtrlDown = keyboardKeys.CTRL.isDown;
        const isShiftDown = keyboardKeys.SHIFT.isDown;

        const mouseWorldPoint = { x: mouseWorldX, y: mouseWorldY }
        InputState.mousePosition[playerEid] = mouseWorldPoint

        InputState.keyboardCtrlDown[playerEid] = isCtrlDown
        InputState.keyboardShiftDown[playerEid] = isShiftDown

        const mouseLeftJustDown = (!InputState.mouseLeftDown[playerEid] && isLeftButtonDown)
        if (mouseLeftJustDown) {
            InputState.downPosition[playerEid] = mouseWorldPoint
            InputState.mouseLeftJustDown[playerEid] = mouseLeftJustDown
            InputState.mouseLeftJustUp[playerEid] = false
        } else {
            InputState.mouseLeftJustUp[playerEid] = (InputState.mouseLeftDown[playerEid] && !isLeftButtonDown)
            InputState.mouseLeftJustDown[playerEid] = false;
        }
        InputState.mouseLeftDown[playerEid] = isLeftButtonDown;

        const mouseRightJustDown = (!InputState.mouseRightDown[playerEid] && isRightButtonDown)
        if (mouseRightJustDown) {
            InputState.downPosition[playerEid] = mouseWorldPoint
            InputState.mouseRightJustDown[playerEid] = mouseRightJustDown
            InputState.mouseRightJustUp[playerEid] = false
        } else {
            InputState.mouseRightJustUp[playerEid] = (InputState.mouseRightDown[playerEid] && !isRightButtonDown)
            InputState.mouseRightJustDown[playerEid] = false;
        }
        InputState.mouseRightDown[playerEid] = isRightButtonDown;
    }
}