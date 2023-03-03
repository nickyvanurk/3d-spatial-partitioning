import * as THREE from 'three';
import { Object3D } from 'three';

export class Entity {
    model: Object3D;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    velocity = new THREE.Vector3();
    acceleration = new THREE.Vector3();
    angularVelocity = new THREE.Vector3();

    constructor(model: THREE.Object3D, position = new THREE.Vector3(), rotation = new THREE.Euler()) {
        this.model = model;
        this.position = position;
        this.rotation = rotation;
    }

    update(dt: number) {
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.velocity.z += this.acceleration.z * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;

        this.rotation.x += this.angularVelocity.x * dt;
        this.rotation.y += this.angularVelocity.y * dt;
        this.rotation.z += this.angularVelocity.z * dt;
    }

    render(alpha: number, dt: number) {
        this.model.position.x = this.position.x + this.velocity.x * dt * alpha;
        this.model.position.y = this.position.y + this.velocity.y * dt * alpha;
        this.model.position.z = this.position.z + this.velocity.z * dt * alpha;

        this.model.rotation.x = this.rotation.x + this.angularVelocity.x * dt * alpha;
        this.model.rotation.y = this.rotation.y + this.angularVelocity.y * dt * alpha;
        this.model.rotation.z = this.rotation.z + this.angularVelocity.z * dt * alpha;
    }
}
