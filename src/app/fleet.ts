import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Fleet {
    geometry = new THREE.BufferGeometry();

    constructor(loadingManager: THREE.LoadingManager) {
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