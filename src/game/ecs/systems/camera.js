import * as bitEcs from 'bitecs';

export const cameraSystem = {
    // init: function (world) {
    //     const { scene, components: {InputState, CameraState} } = world

    // },
    update: function (world) {
        const { InputState, CameraState } = world.components
        const { playerEid } = world.scene
        const scrollSize = 5;
        const isLeftDown = InputState.keyboardLeftDown[playerEid];
        const isUpDown = InputState.keyboardUpDown[playerEid];
        const isRightDown = InputState.keyboardRightDown[playerEid];
        const isDownDown = InputState.keyboardDownDown[playerEid];

        if (isLeftDown && !isRightDown) {
            CameraState.gameObject[playerEid].scrollX -= scrollSize;
        } else if (!isLeftDown && isRightDown) {
            CameraState.gameObject[playerEid].scrollX += scrollSize;
        }
        if (isUpDown && !isDownDown) {
            CameraState.gameObject[playerEid].scrollY -= scrollSize;
        } else if (!isUpDown && isDownDown) {
            CameraState.gameObject[playerEid].scrollY += scrollSize;
        }
    }
}