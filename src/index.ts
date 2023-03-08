import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';

class SceneA extends mln.TreeNode {
    constructor() {
        super();
        console.log('I am scene A');
    }
}

class SceneB extends mln.TreeNode {
    constructor() {
        super();
        console.log('I am scene B');
    }
}

const app = new mln.Application({
    clearColor: 0x131a29,
    scene: [SceneA, SceneB],
});
app.run();
