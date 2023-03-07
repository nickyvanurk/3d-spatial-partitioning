import * as THREE from 'three';
import { type Window } from '../core/window';
import { type Scene } from '../scene/scene';

type Config = {
    antialias: boolean;
    clearColor: string | number;
    outputEncoding: typeof THREE.sRGBEncoding;
    maxDevicePixelRatio: number;
};

export class Renderer {
    private config: Config = {
        antialias: true,
        clearColor: 0x000000,
        outputEncoding: THREE.sRGBEncoding,
        maxDevicePixelRatio: 2,
    };
    private webGlRenderer: THREE.WebGLRenderer;

    constructor(window: Window, config: Partial<Config>) {
        this.config = { ...this.config, ...config };
        this.webGlRenderer = new THREE.WebGLRenderer({ canvas: window.canvas, antialias: this.config.antialias });
        this.webGlRenderer.setClearColor(this.config.clearColor);
        this.webGlRenderer.outputEncoding = this.config.outputEncoding;
        this.onWindowResize(window);
    }

    public onWindowResize(window: Window) {
        this.webGlRenderer.setSize(window.width, window.height);
        this.webGlRenderer.setPixelRatio(window.devicePixelRatio);
    }

    public render(scene: Scene) {
        this.webGlRenderer.render(scene.scene, scene.camera);
    }
}
