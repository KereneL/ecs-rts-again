import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
