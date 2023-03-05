import * as THREE from 'three';

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
    }
}
