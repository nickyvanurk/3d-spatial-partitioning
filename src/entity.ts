import * as THREE from 'three';

export class Entity {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    velocity = new THREE.Vector3();
    acceleration = new THREE.Vector3();
    angularVelocity = new THREE.Vector3();

    constructor(position = new THREE.Vector3(), rotation = new THREE.Euler()) {
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
}
