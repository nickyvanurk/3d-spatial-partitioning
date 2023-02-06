import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { nextPowerOf2 } from "./helpers";

export class Fleet {
    size: number;
    width: number;
    capacity: number;
    geometry = new THREE.BufferGeometry();

    constructor(loadingManager: THREE.LoadingManager, size: number) {
        this.size = size;
        this.width = nextPowerOf2(Math.sqrt(size));
        this.capacity = this.width * this.width;

        new GLTFLoader(loadingManager).load('assets/models/fighter.glb', (gltf) => {
            const geo = (gltf.scene.children[0] as THREE.Mesh).geometry;
            console.log(geo);
        });
    }

    reset() {
        // empty
    }

    update(dt: number) {
        dt;
    }

    render(alpha: number) {
        alpha;
    }
}