import * as bitEcs from 'bitecs';

export const cameraSystem = {
    init: function (world) {
        const { scene } = world
        this.screenWidth = scene.cameras.main.width;
        this.screenHeight = scene.cameras.main.height;
        this.scrollSize = 5;
        this.gapWidth = 10;
    },
    update: function (world) {
        const { InputState, CameraState } = world.components
        const { playerEid } = world.scene

        const { x: mouseSPositionX, y: mouseSPositionY } = InputState.mouseSPosition[playerEid];

        const isLeftDown = InputState.keyboardLeftDown[playerEid];
        const isUpDown = InputState.keyboardUpDown[playerEid];
        const isRightDown = InputState.keyboardRightDown[playerEid];
        const isDownDown = InputState.keyboardDownDown[playerEid];

        const { gapWidth, scrollSize, screenWidth, screenHeight } = this;
        const cameraGameobject = CameraState.gameObject[playerEid]

        // Scroll Horizontally
        if (
            (isLeftDown && !isRightDown) ||
            (mouseSPositionX < gapWidth)
        ) {
            cameraGameobject.scrollX -= scrollSize;
        } else if (
            (!isLeftDown && isRightDown) ||
            (mouseSPositionX > screenWidth - gapWidth)
        ) {
            cameraGameobject.scrollX += scrollSize;
        }
        // Scroll Vertically
        if (
            (isUpDown && !isDownDown) ||
            (mouseSPositionY < gapWidth)
        ) {
            cameraGameobject.scrollY -= scrollSize;
        } else if (
            (!isUpDown && isDownDown) ||
            (mouseSPositionY > screenHeight - gapWidth)
        ) {
            cameraGameobject.scrollY += scrollSize;
        }
    }
}