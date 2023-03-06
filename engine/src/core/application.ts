import * as THREE from 'three';

import { Loop } from './loop';
import { Scene } from '../scene/scene';
import { SceneManager } from '../scene/scene_manager';
import { Window } from './window';

type Config = {
    scene: { new (): Scene } | { new (): Scene }[];
    parent?: string;
    backgroundColor?: string | number;
};

export class Application {
    private renderer: THREE.WebGLRenderer;
    private sceneManager: SceneManager;
    private window: Window;

    constructor(config: Config) {
        this.window = new Window(config.parent || 'body');
        this.window.setResizeCallback(this.resize.bind(this));

        this.renderer = new THREE.WebGLRenderer({ canvas: this.window.canvas, antialias: true });
        this.renderer.setClearColor(config.backgroundColor || 0x000000);
        this.renderer.setSize(this.window.width, this.window.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.sceneManager = new SceneManager(config.scene);
        new Loop(1 / 50, this.fixedUpdate.bind(this), this.update.bind(this));
    }

    fixedUpdate() {
        this.sceneManager.fixedUpdate();
    }

    update() {
        this.sceneManager.update();
        this.renderer.render(this.sceneManager.current.scene, this.sceneManager.current.camera);
    }

    resize() {
        this.sceneManager.current.camera.aspect = window.innerWidth / window.innerHeight;
        this.sceneManager.current.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
