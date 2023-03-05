import * as THREE from 'three';
import { Entity } from './entity';
import { Context } from './types';

import { Vector3 } from 'merlin';

export class Station extends Entity {
    mesh: THREE.Object3D;
    upperCentrifugeSpeed = Math.PI / 180;
    lowerCentrifugeSpeed = Math.PI / 180;
    upperCentrifugeRotation = 0;
    lowerCentrifugeRotation = 0;

    constructor(ctx: Context, position = new Vector3(), rotation = new Vector3()) {
        super(ctx.models.get('station').scene, position, rotation);
        ctx.scene.add(this.mesh);

        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.set(this.rotation.x, this.position.y, this.position.z);
    }

    update(dt: number) {
        super.update(dt);

        this.upperCentrifugeRotation += this.upperCentrifugeSpeed * dt;
        this.lowerCentrifugeRotation += this.lowerCentrifugeSpeed * dt;
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);

        this.mesh.children[0].rotation.z = this.lowerCentrifugeRotation + this.lowerCentrifugeSpeed * dt * alpha;
        this.mesh.children[1].rotation.z = this.upperCentrifugeRotation + this.upperCentrifugeSpeed * dt * alpha;
        this.mesh.children[2].rotation.z = this.upperCentrifugeRotation + this.upperCentrifugeSpeed * dt * alpha;
    }
}
