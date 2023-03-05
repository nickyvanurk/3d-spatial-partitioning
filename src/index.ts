import './style.css';
// import { App } from './app/app';

// const app = new App();
// app.run();

import * as Merlin from 'merlin';

class Main extends Merlin.Scene {
    constructor() {
        super('main');
    }

    init() {
        console.log('init');
    }

    preload() {
        console.log('preload');
    }

    create() {
        console.log('create');
    }
}

new Merlin.Application({
    backgroundColor: 0x131a29,
    scene: Main,
});
