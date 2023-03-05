import * as THREE from 'three';
import { Vector3 } from '../math';

export class Mesh {
    value: THREE.Object3D;
    position = new Vector3();
    rotation = new Vector3();

    constructor(mesh: THREE.Object3D) {
        this.value = mesh;
    }

    update() {
        this.value.position.x = this.position.x;
        this.value.position.y = this.position.y;
        this.value.position.z = this.position.z;

        this.value.rotation.x = this.rotation.x;
        this.value.rotation.y = this.rotation.y;
        this.value.rotation.z = this.rotation.z;
    }
}
