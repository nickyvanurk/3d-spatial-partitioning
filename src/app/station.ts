import * as THREE from 'three';
import { Context } from './types';

export class Station {
    model: THREE.Group;
    rotationSpeed = 0.01;
    rotation = new THREE.Vector3();

    constructor(ctx: Context) {
        this.model = ctx.assets.getModel('station').scene;
        ctx.scene.add(this.model);

        this.model.position.y = 100;
        this.model.rotation.x = -0.05;
        this.model.rotation.z = -0.05;
    }

    update(dt: number) {
        this.rotation.z += this.rotationSpeed * dt;
    }

    render(alpha: number, dt: number) {
        this.model.children[0].rotation.z = this.rotation.z + this.rotationSpeed * dt * alpha;
        this.model.children[1].rotation.z = -this.rotation.z - this.rotationSpeed * dt * alpha;
        this.model.children[2].rotation.z = -this.rotation.z - this.rotationSpeed * dt * alpha;
    }
}
