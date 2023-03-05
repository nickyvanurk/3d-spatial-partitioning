import * as THREE from 'three';
import { Vector3 } from '../math';

export class Mesh {
    value: THREE.Object3D;
    position: Vector3;
    rotation: Vector3;

    constructor(mesh: THREE.Object3D) {
        this.value = mesh;
    }
}
