import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        this.load.setPath('assets');
        [18, 20, 22, 24, 26].forEach(value => {
            this.load.image({
                key: `selection-mark-${value}`,
                url: `./selection${value}.png`,
            })
        })

        this.load.image({
            key: 'selection-mark-20',
            url: './selection22.png',
        })
        this.load.image({
            key: 'selection-mark-22',
            url: './selection22.png',
        })
        this.load.image({
            key: 'selection-mark-24',
            url: './selection22.png',
        })
        this.load.image({
            key: 'selection-mark-26',
            url: './selection26.png',
        })
        this.load.spritesheet({
            key: 'tank',
            url: './tank.png',
            frameConfig: {
                frameWidth: 24,
                frameHeight: 24,
            }
        })
        this.load.spritesheet({
            key: 'quad',
            url: './quad.png',
            frameConfig: {
                frameWidth: 12,
                frameHeight: 12,
            }
        })
        this.load.spritesheet({
            key: 'infantry',
            url: './infantry.png',
            frameConfig: {
                frameWidth: 13,
                frameHeight: 13,
            }
        })
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
    }
}
