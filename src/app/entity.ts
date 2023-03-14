import { Vector3, Mesh } from 'merlin';

export class Entity {
    mesh: Mesh;
    position: Vector3;
    rotation: Vector3;
    velocity = new Vector3();
    acceleration = new Vector3();
    angularVelocity = new Vector3();
    maxSpeed = 1;

    constructor(mesh: Mesh, position = new Vector3(), rotation = new Vector3()) {
        this.mesh = mesh;
        this.position = position;
        this.rotation = rotation;

        this.mesh.position.copy(position);
        this.mesh.rotation.copy(rotation);
        this.mesh.update();
    }

    update(dt: number) {
        this.velocity.add(Vector3.mult(this.acceleration, dt));
        this.velocity.limit(this.maxSpeed);
        this.position.add(Vector3.mult(this.velocity, dt));
        this.rotation.add(Vector3.mult(this.angularVelocity, dt));
    }

    render(alpha: number, dt: number) {
        this.mesh.position.copy(Vector3.add(this.position, Vector3.mult(this.velocity, dt * alpha)));
        if (this.velocity.length() > 0 || this.angularVelocity.length() > 0) {
            this.mesh.rotation.copy(Vector3.add(this.rotation, Vector3.mult(this.angularVelocity, dt * alpha)));
        }
        this.mesh.update();
    }

    applyForce(force: Vector3) {
        this.acceleration.add(force);
    }
}
