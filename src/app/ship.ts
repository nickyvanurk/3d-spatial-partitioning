import { Mesh, Vector3 } from 'merlin';
import { Entity } from './entity';
import { Context } from './types';
import * as THREE from 'three';
import { Asteroid } from './asteroid';

const obj = new THREE.Object3D();

export class Ship extends Entity {
    maxForce = 50;
    arrived = false;

    resource = 0;
    miningRange = 16;

    constructor(ctx: Context, position = new Vector3(), rotation = new Vector3()) {
        super(new Mesh(ctx.models.get('spaceship').scene), position, rotation);
        ctx.scene.add(this.mesh.value);

        this.maxSpeed = 50;
    }

    update(dt: number) {
        super.update(dt);
        this.acceleration.set(0, 0, 0);

        obj.lookAt(new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z));
        this.rotation.x = obj.rotation.x;
        this.rotation.y = obj.rotation.y;
        this.rotation.z = obj.rotation.z;
    }

    render(alpha: number, dt: number) {
        super.render(alpha, dt);
    }

    seek(target: Vector3) {
        const desired = Vector3.sub(target, this.position);
        desired.normalizeInPlace();
        desired.mult(this.maxSpeed);
        const steer = Vector3.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        this.applyForce(steer);
    }

    arrive(target: Vector3, slowRadius = 10, targetRadius = 0, margin = 0.1) {
        const desired = Vector3.sub(target, this.position);
        const d = desired.length() - targetRadius;
        desired.setLengthInPlace(d > slowRadius ? this.maxSpeed : (d / slowRadius) * this.maxSpeed);
        const steer = Vector3.sub(desired, this.velocity);
        steer.mult(10); // 0.1s to reach desired speed
        steer.limit(this.maxForce);
        this.applyForce(steer);

        this.arrived = d < margin;
    }

    mine(asteroid: Asteroid, multiplier = 5) {
        const distance = Vector3.sub(asteroid.position, this.position).length();
        if (distance > this.miningRange) {
            this.arrive(asteroid.position, 40, this.miningRange - 1, 1);
        } else {
            if (asteroid.resource > 0) {
                asteroid.resource -= multiplier;
                this.resource += multiplier;
            }
        }
    }
}
