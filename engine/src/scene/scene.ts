import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from '../renderer';
import type { SceneManager } from './scene_manager';

interface IScene {
    name: string;

    init: () => void;
    preload: () => void;
    create: () => void;
    fixedUpdate: () => void;
    update: () => void;
}

type loadErrorCallback = (url: string) => void;
type loadProgressCallback = (percent: number, itemsLoaded: number, itemsTotal: number, url: string) => void;
type loadDoneCallback = () => void;

export class Scene implements IScene {
    load = { on: this.setLoadCallback.bind(this), gltf: this.loadGLTF.bind(this) };
    add = { mesh: this.addMesh.bind(this), points: this.addPoints.bind(this) };

    scene = new THREE.Scene();
    // Create Viewport class with viewport information
    camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 0.1, 1000);

    private loadingManager = new THREE.LoadingManager();
    private loader = { gltf: new GLTFLoader(this.loadingManager) };
    private meshes: { [key: string]: Mesh } = {};

    manager: SceneManager;

    constructor(readonly name = 'default') {
        this.loadingManager.onLoad = this.create.bind(this);
        this.camera.position.z = 20;
    }

    init() {
        /* virtual method */
    }

    preload() {
        this.create();
    }

    create() {
        /* virtual method */
    }

    fixedUpdate() {
        /* virtual method */
    }

    update() {
        /* virtual method */
    }

    switch(name: string) {
        this.manager.switch(name);
    }

    private loadGLTF(name: string, path: string) {
        this.loader.gltf.load(path, gltf => (this.meshes[name] = new Mesh(gltf.scene)));
    }

    private addMesh(name: string) {
        this.scene.add(this.meshes[name].value.clone());
    }

    private addPoints(points: THREE.Points) {
        this.scene.add(points);
    }

    private setLoadCallback(key: string, callback: loadErrorCallback | loadProgressCallback | loadDoneCallback) {
        switch (key) {
            case 'error':
                this.loadingManager.onError = callback as loadErrorCallback;
                break;
            case 'progress':
                this.loadingManager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
                    const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
                    (callback as loadProgressCallback)(percent, itemsLoaded, itemsTotal, url);
                };
                break;
            case 'done':
                this.loadingManager.onLoad = () => {
                    (callback as loadDoneCallback)();
                    this.create();
                };
                break;
        }
    }
}
