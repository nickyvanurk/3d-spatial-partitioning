import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { AssetManager } from "./asset_manager";
import { Fleet } from "./fleet";

export class App {
    keys: { [key: string]: boolean; };
    running: boolean;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    controls: OrbitControls;
    fleet: Fleet;
    assetManager: AssetManager;
    station: THREE.Group;
    composer: EffectComposer;

    constructor() {
        window.addEventListener('keydown', this.processEvents.bind(this));
        window.addEventListener('keyup', this.processEvents.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('dblclick', this.toggleFullscreen.bind(this));

        this.keys = {};

        const canvas = document.querySelector('canvas.webgl');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(0x131A29);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.y = 400;
        this.camera.position.z = 800;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.maxDistance = 1500;

        this.scene = new THREE.Scene();

        const ambiLight = new THREE.AmbientLight(0xffffff);
        ambiLight.intensity = 0.5;
        this.scene.add(ambiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.intensity = 0.8;
        dirLight.position.setScalar(1);
        this.scene.add(dirLight);

        const renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const loadingBar: HTMLElement = document.querySelector('.bar');
            const percent = Math.floor((itemsLoaded / itemsTotal * 100));
            loadingBar.style.width =  `${percent}%`;

            if (percent == 100) {
                const loadingScreen: HTMLElement = document.querySelector('.loadingScreen');
                // loadingScreen.style.opacity = '0';
                loadingScreen.addEventListener('transitionend', () => {
                    // loadingScreen.style.zIndex = '-1';
                });
            }
        };
        loadingManager.onLoad = this.init.bind(this);

        this.assetManager = new AssetManager(loadingManager);
        this.assetManager.loadModel('spaceship', 'assets/models/spaceship.glb');
        this.assetManager.loadModel('station', 'assets/models/station.glb');
    }

    init() {
        this.station = this.assetManager.getModel('station').scene;
        this.station.position.y = 100;
        this.station.rotation.x = -0.05;
        this.station.rotation.z = -0.05;
        this.scene.add(this.station);

        this.fleet = new Fleet(this.scene, this.renderer, this.assetManager.getModel('spaceship'), 50, 1000);

        this.running = true;
    }

    reset() {
        // empty
    }

    processEvents(event: KeyboardEvent) {
        this.keys[event.code] = event.type === 'keydown';

        if (event.type === 'keydown') {
            if (this.keys['KeyP']) {
                this.running = !this.running;
            }

            if (this.keys['KeyR']) {
                this.reset();
            }
        }
    }

    update(dt: number) {
        this.station.children[0].rotation.z += 0.01 * dt;
        this.station.children[1].rotation.z -= 0.01 * dt;
        this.station.children[2].rotation.z -= 0.01 * dt;

        this.fleet.update(dt);
    }

    render(alpha: number) {
        if (this.running) {
            this.fleet.render(alpha);
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.querySelector('body').requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}