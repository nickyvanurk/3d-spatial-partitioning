import { Mesh, Vector3 } from 'merlin';
import { Entity } from './entity';
import { Context } from './types';

export class Ship extends Entity {
    maxForce = 5;

    constructor(ctx: Context, position = new Vector3(), rotation = new Vector3()) {
        super(new Mesh(ctx.models.get('spaceship').scene), position, rotation);
        ctx.scene.add(this.mesh.value);

        this.maxSpeed = 100;
    }

    update(dt: number) {
        this.seek(new Vector3(0, 5, 5));
        super.update(dt);
        this.acceleration.set(0, 0, 0);
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);
    }

    seek(target: Vector3) {
        const desired = target.sub(this.position);
        desired.normalizeInPlace();
        desired.multiplyScalarInPlace(this.maxSpeed);
        const steer = desired.sub(this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }
}
