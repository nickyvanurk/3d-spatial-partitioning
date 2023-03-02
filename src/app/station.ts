import * as THREE from 'three';
import { Entity } from '../entity';
import { Context } from './types';

export class Station extends Entity {
    model: THREE.Object3D;

    constructor(ctx: Context) {
        super(new THREE.Vector3(0, 100, 0), new THREE.Euler(-0.05, 0, -0.05));
        this.angularVelocity.y = 0.01;

        this.model = ctx.models.get('station').scene;
        this.model.position.copy(this.position);
        this.model.rotation.copy(this.rotation);
        ctx.scene.add(this.model);
    }

    update(dt: number) {
        super.update(dt);
    }

    render(alpha: number, dt: number) {
        this.model.children[0].rotation.z = this.rotation.y + this.angularVelocity.y * dt * alpha;
        this.model.children[1].rotation.z = -this.rotation.y - this.angularVelocity.y * dt * alpha;
        this.model.children[2].rotation.z = -this.rotation.y - this.angularVelocity.y * dt * alpha;
    }
}
