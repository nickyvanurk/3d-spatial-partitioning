import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface IScene {
    name: string;

    init: () => void;
    preload: () => void;
    create: () => void;
    fixedUpdate: () => void;
    update: () => void;
}

export class Scene implements IScene {
    load = { gltf: this.loadGLTF.bind(this) };
    add = { mesh: this.getGLTF.bind(this) };

    private loadingManager = new THREE.LoadingManager();
    private loader = { gltf: new GLTFLoader(this.loadingManager) };
    private meshes: { [key: string]: GLTF } = {};

    constructor(readonly name = 'default') {
        this.loadingManager.onLoad = this.create.bind(this);
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

    private loadGLTF(name: string, path: string) {
        this.loader.gltf.load(path, gltf => (this.meshes[name] = gltf));
    }

    private getGLTF(name: string) {
        return this.meshes[name];
    }
}
