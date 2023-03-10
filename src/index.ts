import './style.css';
// import { Tree } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';
import { Camera3D } from '../engine/src/scene/camera_3d';

class Main extends mln.Scene {
    init() {
        this.name = 'main';

        const camera = new Camera3D();
        this.addChild(camera);
    }
}

const app = new mln.Application({
    clearColor: 0x131a29,
    scene: Main,
});
app.run();
