import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AssetManager } from './asset_manager';
import { World } from './world';

export class App {
    running: boolean;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    controls: OrbitControls;
    assetManager: AssetManager;
    composer: EffectComposer;
    world: World;

    constructor() {
        const canvas = document.querySelector('canvas.webgl');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(0x131a29);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.y = 400;
        this.camera.position.z = 800;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.maxDistance = 1500;

        this.scene = new THREE.Scene();

        const renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const loadingBar: HTMLElement = document.querySelector('.bar');
            const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
            loadingBar.style.width = `${percent}%`;

            if (percent === 100) {
                const loadingScreen: HTMLElement = document.querySelector('.loadingScreen');
                loadingScreen.style.opacity = '0';
                loadingScreen.addEventListener('transitionend', () => {
                    loadingScreen.style.zIndex = '-1';
                });
            }
        };
        loadingManager.onLoad = this.init.bind(this);

        this.assetManager = new AssetManager(loadingManager);
        this.assetManager.loadModel('spaceship', 'assets/models/spaceship.glb');
        this.assetManager.loadModel('station', 'assets/models/station.glb');
    }

    init() {
        const ctx = {
            renderer: this.renderer,
            scene: this.scene,
            assets: this.assetManager,
        };

        this.world = new World(ctx);
        this.running = true;
    }

    reset() {
        // empty
    }

    processEvents(_keys: { [key: string]: boolean }) {
        // empty
    }

    update(dt: number) {
        this.world.update(dt);
    }

    render(alpha: number, dt: number) {
        if (this.running) {
            this.world.render(alpha, dt);
        }

        this.controls.update();
        this.composer.render();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
}
