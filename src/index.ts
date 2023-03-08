import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';

class Scene extends mln.TreeNode {
    constructor(name = 'Scene') {
        super(name);
        console.log('I am ', this.name);
    }
}

class SceneA extends Scene {
    constructor() {
        super('Scene A');
    }
}

class SceneB extends Scene {
    constructor() {
        super('Scene B');
    }
}

const app = new mln.Application({
    clearColor: 0x131a29,
    scene: [SceneA, SceneB],
});
app.run();
