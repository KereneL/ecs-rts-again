import * as bitEcs from 'bitecs';

export const getInputSystem = {
    // init: function (world) { },
    update: function (world) {
        const { InputState } = world.components
        const { scene } = world;
        const { playerEid, keyboardKeys } = scene;
        const { mousePointer } = scene.input

        const isLeftButtonDown = mousePointer.leftButtonDown()
        const isRightButtonDown = mousePointer.rightButtonDown()
        const isCtrlDown = keyboardKeys.CTRL.isDown;
        const isShiftDown = keyboardKeys.SHIFT.isDown;

        InputState.mousePosition[playerEid] = mousePointer.position

        InputState.keyboardCtrlDown[playerEid] = isCtrlDown
        InputState.keyboardShiftDown[playerEid] = isShiftDown

        const mouseLeftJustDown = (!InputState.mouseLeftDown[playerEid] && isLeftButtonDown)
        InputState.mouseLeftJustDown[playerEid] = mouseLeftJustDown
        if (mouseLeftJustDown) { InputState.downPosition[playerEid] = { x: mousePointer.position.x, y: mousePointer.position.y } }
        InputState.mouseLeftJustUp[playerEid] = (InputState.mouseLeftDown[playerEid] && !isLeftButtonDown)
        InputState.mouseLeftDown[playerEid] = isLeftButtonDown

        const mouseRightJustDown = (!InputState.mouseRightDown[playerEid] && isRightButtonDown)
        InputState.mouseRightJustDown[playerEid] = mouseRightJustDown
        if (mouseRightJustDown) { InputState.downPosition[playerEid] = { x: mousePointer.position.x, y: mousePointer.position.y } }
        InputState.mouseRightJustUp[playerEid] = (InputState.mouseRightDown[playerEid] && !isRightButtonDown)
        InputState.mouseRightDown[playerEid] = isRightButtonDown
    }
}