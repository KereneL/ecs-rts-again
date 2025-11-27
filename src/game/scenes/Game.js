import * as bitEcs from "bitecs";
import { Scene, Sprite, Image } from 'phaser';
import { createGameWorld } from '../ecs/ecs';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        this.input.mouse.disableContextMenu();
        this.keyboardKeys = {
            CTRL: this.input.keyboard.addKey("CTRL", true, false),
            SHIFT: this.input.keyboard.addKey("SHIFT", true, false),
        }
        this.actorsPool = this.add.group({
            key: '__WHITE',
            classType: Sprite,
            visible: false,
            active: false,
        })
        this.boxSelectRect = this.add.rectangle()
            .setStrokeStyle(2, 0xffffff)
            .setFillStyle(0xffffff, 0.25)
            .setOrigin(0)
            .setVisible(false);

        this.world = createGameWorld(this);
        this.world.initSystems()
        this.playerEid = bitEcs.addEntity(this.world);

        bitEcs.addComponent(this.world, this.playerEid, this.world.components.InputState)

        this.seedWorldWithUnits(48);

        this.input.on('pointerup', (pointer) => {
            if (pointer.button != 2) return;
            const { Transform, BodyOrientation, Mobile, OrderedMove, IsSelected, IsHovered } = this.world.components
            const { x, y } = pointer
            for (const eid of bitEcs.query(this.world, [Transform, BodyOrientation, Mobile, IsSelected])) {
                bitEcs.addComponent(this.world, eid, OrderedMove)
                OrderedMove.target[eid] = new Phaser.Math.Vector2(x, y)
                bitEcs.removeComponent(this.world, eid, IsHovered)
            }

        })
    }
    getRandomPointOnMap() {
        let { width, height } = this.sys.game.canvas;
        const pX = Math.round(Phaser.Math.RND.between(0, width));
        const pY = Math.round(Phaser.Math.RND.between(0, height));
        return new Phaser.Math.Vector2(pX, pY)
    }
    seedWorldWithUnits(unitAmount) {
        for (let i = 0; i < unitAmount; i++) {
            this.unitColor = Phaser.Display.Color.HSLToColor(0.11, 1, Phaser.Math.Linear(0.25, 0.55, i / unitAmount))
            this.createUnit()
        }
    }
    createUnit() {
        this.createTank()
    }
    createTank() {
        const world = this.world
        const { Transform, BodyOrientation, Mobile, RendersSprite, SpawningNow, Selectable, Interactable, IsSelected } = this.world.components
        const unit = bitEcs.addEntity(world);

        bitEcs.addComponent(world, unit, Transform);
        Transform.centerPosition[unit] = this.getRandomPointOnMap()

        bitEcs.addComponent(world, unit, BodyOrientation);
        const angle = Phaser.Math.Angle.Random()
        BodyOrientation.angle[unit] = angle

        bitEcs.addComponent(world, unit, Mobile);
        Mobile.turnSpeed[unit] = 1;
        Mobile.speed[unit] = 80;
        Mobile.turnsInPlace[unit] = true;

        bitEcs.addComponent(world, unit, RendersSprite);
        RendersSprite.spriteKey[unit] = 'tank'
        RendersSprite.tint[unit] = this.unitColor.color
        RendersSprite.depth[unit] = 1;
        RendersSprite.scale[unit] = 2;

        bitEcs.addComponent(world, unit, Selectable);
        Selectable.selectionMarkerSize[unit] = 22

        bitEcs.addComponent(world, unit, Interactable)
        Interactable.hitAreaType[unit] = 'circle';
        Interactable.hitAreaRadius[unit] = 20;

        bitEcs.addComponent(world, unit, SpawningNow);
    }
    update(_time, delta) {
        this.world.updateWorld(delta)
    }
}
