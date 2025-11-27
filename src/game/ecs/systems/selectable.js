import * as bitEcs from 'bitecs';
import * as Phaser from 'phaser';

export const selectableSystem = {
  // init: function (world) {},
  update: function (world) {

    const { InputState, Interactable, Selectable, IsSelected, IsHovered, Transform } = world.components
    const circleVar = new Phaser.Geom.Circle();
    const rectVar = new Phaser.Geom.Rectangle();

    for (const eid of bitEcs.query(world, [Interactable, Transform, Selectable])) {

    }
  }
}
