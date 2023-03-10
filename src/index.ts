import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';

class Main extends mln.Scene {
    constructor() {
        super('main');
    }
}

const app = new mln.Application({
    clearColor: 0x131a29,
    scene: Main,
});
app.run();
