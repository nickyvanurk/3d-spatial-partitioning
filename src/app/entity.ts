import * as THREE from 'three';
import { Object3D } from 'three';

export class Entity {
    mesh: Object3D;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    velocity = new THREE.Vector3();
    acceleration = new THREE.Vector3();
    angularVelocity = new THREE.Vector3();

    constructor(mesh: THREE.Object3D, position = new THREE.Vector3(), rotation = new THREE.Euler()) {
        this.mesh = mesh;
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
        this.mesh.position.x = this.position.x + this.velocity.x * dt * alpha;
        this.mesh.position.y = this.position.y + this.velocity.y * dt * alpha;
        this.mesh.position.z = this.position.z + this.velocity.z * dt * alpha;

        this.mesh.rotation.x = this.rotation.x + this.angularVelocity.x * dt * alpha;
        this.mesh.rotation.y = this.rotation.y + this.angularVelocity.y * dt * alpha;
        this.mesh.rotation.z = this.rotation.z + this.angularVelocity.z * dt * alpha;
    }
}
