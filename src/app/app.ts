import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Flock } from "./flock";

export class App {
    keys: { [key: string]: boolean; };
    running: boolean;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    controls: OrbitControls;
    flock: Flock;

    constructor() {
        window.addEventListener('keydown', this.processEvents.bind(this));
        window.addEventListener('keyup', this.processEvents.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('dblclick', this.toggleFullscreen.bind(this));

        const canvas = document.querySelector('canvas.webgl');
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(0x131A29);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 900);
        this.camera.position.y = 300;
        this.camera.position.z = 600;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.maxDistance = 650;

        this.scene = new THREE.Scene();

        const ambiLight = new THREE.AmbientLight(0x222222);
        ambiLight.intensity = 10;
        this.scene.add(ambiLight);

        this.flock = new Flock(50, 200);
        this.scene.add(this.flock.particles);

        this.reset();

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        loadingManager.onLoad = () => {
            console.log('Loading complete!');
        };
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        new GLTFLoader(loadingManager).load('assets/models/fighter.glb', (gltf) => {
            this.scene.add(gltf.scene);
        });
    }

    reset() {
        this.keys = {};
        this.running = true;
        this.flock.reset();
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
        this.flock.update(dt);
    }

    render(alpha: number) {
        this.flock.render(alpha);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.querySelector('body').requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}