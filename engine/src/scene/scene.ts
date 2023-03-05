import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from '../render';

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
    add = { mesh: this.addMesh.bind(this) };

    private loadingManager = new THREE.LoadingManager();
    private loader = { gltf: new GLTFLoader(this.loadingManager) };
    private meshes: { [key: string]: Mesh } = {};

    private scene = new THREE.Scene();

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
        this.loader.gltf.load(path, gltf => (this.meshes[name] = new Mesh(gltf.scene)));
    }

    private addMesh(name: string) {
        this.scene.add(this.meshes[name].value.clone());
    }
}
