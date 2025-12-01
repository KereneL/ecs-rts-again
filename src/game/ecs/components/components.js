import { GameObjects } from "phaser";

export const InputState = {
  mouseLeftDown: [],
  mouseLeftJustDown: [],
  mouseLeftJustUp: [],
  mouseRightDown: [],
  mouseRightJustDown: [],
  mouseRightJustUp: [],
  mouseWPosition: [],
  mouseSPosition: [],
  downPosition: [],
  isDragging: [],
  keyboardCtrlDown: [],
  keyboardShiftDown: [],
  keyboardLeftDown: [],
  keyboardUpDown: [],
  keyboardRightDown: [],
  keyboardDownDown: [],
}
export const CameraState = {
  center: [],
  zoom: [],
  position: [],

  gameObject: [],
}
export const Interactable = {
  hitAreaType: [],
  hitAreaRadius: [],
  hitAreaWidth: [],
  hitAreaHeight: [],
}
export const Transform = {
  centerPosition: [],
  size: [],
};
export const BodyOrientation = {
  angle: [],
  quantizedAngle: [], //8-dir
};
export const RendersSprite = {
  spriteKey: [],
  tint: [],
  scale: [],
  depth: [],
  framesFor360: [],

  gameObject: [],
};

export const Selectable = {
  selectionMarkerSize: [],
  selectorEid: [],
}
export const Targetable = {
  targetTypes: [],//Ground, Infantry
};

export const Mobile = {
  locomotor: [],
  turnSpeed: [],
  speed: [],
  turnsInPlace: [],
};
export const OrderedMove = {
  target: [],
  angleToTarget: [],
}
export const IsMoving = {
  target: [],
  justStartedMovement: [],
}
export const IsRotating = {}
export const IsTraversing = {}
export const IsSelected = {}
export const IsHovered = {}
export const SpawningNow = {}

export const Health = {
  hp: [],
  maxHP: [],
  isDead: [],
}
export const HitShape = {

}
export const FollowEntity = {
  eid: [],
  offset: [],
  depthOffset: [],
}
export const AttackFrontal = {
  facingTolerance: 0
}

