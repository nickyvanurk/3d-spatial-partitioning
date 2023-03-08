import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';
// import { Main } from './scenes';

class Scene extends mln.TreeNode {
    constructor() {
        super();
        console.log('I am a scene');
    }
}

new mln.Application({
    clearColor: 0x131a29,
    scene: Scene,
});
