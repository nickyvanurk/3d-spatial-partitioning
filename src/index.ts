import './style.css';
// import { App } from './app/app';

// const app = new App();
// app.run();

import * as Merlin from 'merlin';

class Loading extends Merlin.Scene {
    constructor() {
        super('loading');
    }

    init() {
        console.log('init ' + this.name);
    }

    preload() {
        console.log('preload ' + this.name);
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
        console.log('create ' + this.name);
        this.add.mesh('spaceship');
    }
}

class Main extends Merlin.Scene {
    constructor() {
        super('main');
    }

    init() {
        console.log('init ' + this.name);
    }

    preload() {
        console.log('preload ' + this.name);
    }

    create() {
        console.log('create ' + this.name);
    }
}

new Merlin.Application({
    backgroundColor: 0x131a29,
    scene: [Loading, Main],
});
