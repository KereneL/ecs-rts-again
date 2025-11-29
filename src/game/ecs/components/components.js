import { GameObjects } from "phaser";

export const InputState = {
  mouseLeftDown: [],
  mouseLeftJustDown: [],
  mouseLeftJustUp: [],
  mouseRightDown: [],
  mouseRightJustDown: [],
  mouseRightJustUp: [],
  mousePosition: [],
  downPosition: [],
  isDragging: [],
  keyboardCtrlDown: [],
  keyboardShiftDown: [],
}
export const Interactable = {
  hitAreaType: [],
  hitAreaRadius: [],
  hitAreaWidth: [],
  hitAreaHeight: [],
}
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
export const HitShape = {

}
export const Transform = {
  centerPosition: [],
  size: [],
};
export const Health = {
  hp: [],
  maxHP: [],
  isDead: [],
}
export const Selectable = {
  selectionMarkerSize: [],
  selectorEid: [],
}
export const Targetable = {
  targetTypes: [],//Ground, Infantry
};
export const AttackFrontal = {
  facingTolerance: 0
}
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
  isRotating: [],
  isTraversing: [],
}
export const FollowEntity = {
  eid: [],
  offset: [],
  depthOffset: [],
}
export const IsSelected = {}
export const IsHovered = {}

export const SpawningNow = {}