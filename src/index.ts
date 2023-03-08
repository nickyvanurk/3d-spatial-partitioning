import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';

class SceneA extends mln.Scene {
    constructor() {
        super('Scene A');
        console.log('I am ', this.name);
        // console.log(this.tree);
        // console.log(this.root);
    }
}

class SceneB extends mln.Scene {
    constructor() {
        super('Scene B');
        console.log('I am ', this.name);
    }
}

const app = new mln.Application({
    clearColor: 0x131a29,
    scene: [SceneA, SceneB],
});
app.run();
