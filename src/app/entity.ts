import * as THREE from 'three';
import { Object3D } from 'three';

import { Vector3 } from 'merlin';

export class Entity {
    mesh: Object3D;
    position: Vector3;
    rotation: Vector3;
    velocity = new Vector3();
    acceleration = new Vector3();
    angularVelocity = new Vector3();

    constructor(mesh: THREE.Object3D, position = new Vector3(), rotation = new Vector3()) {
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;

        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
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
