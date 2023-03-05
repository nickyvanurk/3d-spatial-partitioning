import * as Merlin from 'merlin';

export class Main extends Merlin.Scene {
    constructor() {
        super('main');
    }

    preload() {
        this.load.gltf('spaceship', 'assets/models/fighter.glb');

        this.load.on('progress', (percent: number) => {
            const loadingBar = document.querySelector('.bar') as HTMLElement;
            loadingBar.style.width = `${percent}%`;
        });

        this.load.on('done', () => {
            const loadingScreen = document.querySelector('.loadingScreen') as HTMLElement;
            loadingScreen.style.opacity = '0';
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.zIndex = '-1';
            });
        });
    }

    create() {
        this.add.mesh('spaceship');
    }
}
