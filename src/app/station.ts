import * as THREE from 'three';
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Station {
    model: THREE.Group;
    rotationSpeed = 0.01;
    rotation = new THREE.Vector3();

    constructor(model: GLTF) {
        this.model = model.scene;
        this.model.position.y = 100;
        this.model.rotation.x = -0.05;
        this.model.rotation.z = -0.05;
    }

    update(dt: number) {
        this.rotation.z += this.rotationSpeed * dt;
    }

    render(alpha: number, dt: number) {
        this.model.children[0].rotation.z = this.rotation.z + (this.rotationSpeed * dt * alpha);
        this.model.children[1].rotation.z = -this.rotation.z - (this.rotationSpeed * dt * alpha);
        this.model.children[2].rotation.z = -this.rotation.z - (this.rotationSpeed * dt * alpha);
    }
}