import * as THREE from 'three';
import { Mesh, Vector3 } from 'merlin';
import { Entity } from './entity';
import { Context } from './types';

export class Asteroid extends Entity {
    constructor(ctx: Context, position = new Vector3(), rotation = new Vector3()) {
        const geometry = new THREE.SphereGeometry(5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sphere = new THREE.Mesh(geometry, material);
        super(new Mesh(sphere), position, rotation);
        ctx.scene.add(this.mesh.value);
    }

    update(dt: number) {
        super.update(dt);
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);
    }
}
