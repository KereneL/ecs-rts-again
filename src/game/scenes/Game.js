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
            SHIFT: this.input.keyboard.addKey("SHIFT", true, false),
            CTRL: this.input.keyboard.addKey("CTRL", true, false),
            LEFT: this.input.keyboard.addKey("LEFT", true, false),
            UP: this.input.keyboard.addKey("UP", true, false),
            RIGHT: this.input.keyboard.addKey("RIGHT", true, false),
            DOWN: this.input.keyboard.addKey("DOWN", true, false),
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
        const { InputState, CameraState } = this.world.components
        bitEcs.addComponent(this.world, this.playerEid, InputState)
        bitEcs.addComponent(this.world, this.playerEid, CameraState)
        CameraState.gameObject[this.playerEid] = this.cameras.main;

        this.seedWorldWithUnits(48);

        this.input.on('pointerup', (pointer) => {
            if (pointer.button != 2) return;
            const { Transform, BodyOrientation, Mobile, OrderedMove, IsSelected, IsHovered } = this.world.components
            const { worldX: x, worldY: y } = pointer
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
            this.unitColor = Phaser.Display.Color.HSLToColor(225 / 360, 35.9 / 100, Phaser.Math.Linear(0.45, 0.65, i / unitAmount))
            this.createUnit()
        }
    }
    createUnit() {
        const unitAdded = {
            Transform: {
                centerPosition: this.getRandomPointOnMap(),
            },
            BodyOrientation: {
                angle: Phaser.Math.Angle.Random(),
            },
            SpawningNow: {},
        }
        const unitConfig = (Math.random() > 0.5) ? tankConfig : quadConfig;
        Object.assign(unitConfig, unitAdded)
        Object.assign(unitConfig.RendersSprite, {
            tint: this.unitColor.color,
            depth: 1,
            scale: 1,
        })
        this.spawnUnit(unitConfig)
    }
    spawnUnit(unitConfig) {
        const world = this.world
        const unit = bitEcs.addEntity(world);
        for (const compKey of Object.keys(unitConfig)) {
            const Component = this.world.components[compKey]
            if (!Component) continue;
            bitEcs.addComponent(world, unit, Component);

            for (const propKey of Object.keys(unitConfig[compKey])) {
                const Prop = Component[propKey];
                if (!Prop) continue;

                Prop[unit] = unitConfig[compKey][propKey]
            }
        }
    }
    update(_time, delta) {
        this.input.mousePointer.updateWorldPoint(this.cameras.main)
        this.world.updateWorld(delta)
    }
}

const tankConfig = {
    Mobile: {
        turnSpeed: 1,
        speed: 80,
        turnsInPlace: true,
    },
    RendersSprite: {
        spriteKey: 'tank2',
        framesFor360: 32,
    },
    Selectable: {
        selectionMarkerSize: 50,
    },
    Interactable: {
        hitAreaType: 'circle',
        hitAreaRadius: 25
    },
}
const quadConfig = {
    Mobile: {
        turnSpeed: 1.25,
        speed: 90,
        turnsInPlace: false,
    },
    RendersSprite: {
        spriteKey: 'quad2',
        framesFor360: 32,
    },
    Selectable: {
        selectionMarkerSize: 26,
    },
    Interactable: {
        hitAreaType: 'circle',
        hitAreaRadius: 26
    },
}