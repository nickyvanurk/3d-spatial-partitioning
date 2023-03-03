import * as THREE from 'three';
import { Entity } from './entity';

export class Station extends Entity {
    mesh: THREE.Object3D;

    constructor(mesh: THREE.Object3D) {
        super(mesh);
        this.angularVelocity.y = 0.01;

        this.mesh.position.copy(this.position);
        this.mesh.rotation.copy(this.rotation);
    }

    update(dt: number) {
        super.update(dt);
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);

        // this.mesh.children[0].rotation.z = this.rotation.y + this.angularVelocity.y * dt * alpha;
        // this.mesh.children[1].rotation.z = -this.rotation.y - this.angularVelocity.y * dt * alpha;
        // this.mesh.children[2].rotation.z = -this.rotation.y - this.angularVelocity.y * dt * alpha;
    }
}
