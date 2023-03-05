import * as THREE from 'three';

import { Loop } from './loop';
import { Scene } from './scene';

type Config = {
    scene: Scene | Scene[];
    parent?: string;
    backgroundColor?: string | number;
};

export class Application {
    running = false;
    renderer: THREE.WebGLRenderer;
    scene: Scene | Scene[];

    private loop: Loop;

    constructor(config: Config) {
        this.scene = config.scene;

        const canvas = document.createElement('canvas');
        const parent = document.querySelector(config.parent || 'body');
        parent.appendChild(canvas);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(config.backgroundColor || 0x000000);
        this.renderer.setSize(parent.clientWidth, parent.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.loop = new Loop(1 / 50);
        this.loop.start(this.fixedStep.bind(this), this.step.bind(this));
    }

    fixedStep(_time: number, _fixedDelta: number) {
        //
    }

    step(__time: number, _delta: number, _alpha: number, _fixedDelta: number) {
        //
    }
}
