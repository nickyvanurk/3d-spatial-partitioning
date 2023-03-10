import { Mesh, Vector3 } from 'merlin';
import { Entity } from './entity';
import { Context } from './types';

export class Ship extends Entity {
    constructor(ctx: Context, position = new Vector3(), rotation = new Vector3()) {
        super(new Mesh(ctx.models.get('spaceship').scene), position, rotation);
        ctx.scene.add(this.mesh.value);
    }

    update(dt: number) {
        super.update(dt);
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);
    }
}
