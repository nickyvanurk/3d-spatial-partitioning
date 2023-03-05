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

        this.load.gltf('spaceship', 'assets/models/station.glb');
    }

    create() {
        console.log('create ' + this.name);

        console.log(this.add.mesh('spaceship'));
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
