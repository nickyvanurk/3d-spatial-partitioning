import * as THREE from 'three';

export class Boid {
    prevPosition: THREE.Vector3;
    position: THREE.Vector3;
    velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
    );
    acceleration = new THREE.Vector3();
    maxForce = 30;
    maxSpeed = 120;
    separationMultiplier = 4.5;
    alignmentMultiplier = 0.1;
    cohesionMultiplier = 0.1;
    perceptionRadius = 30;

    constructor(x: number, y: number, z: number) {
        this.prevPosition = new THREE.Vector3(x, y, z);
        this.position = this.prevPosition;
    }

    update(dt: number) {
        this.prevPosition = this.position.clone();
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.velocity.clampLength(0, this.maxSpeed);
        this.acceleration.set(0, 0, 0);
    }

    flock(boids: Array<Boid>) {
        const separation = this.separation(boids);
        const alignment = this.align(boids);
        const cohesion = this.cohesion(boids);

        separation.multiplyScalar(this.separationMultiplier);
        alignment.multiplyScalar(this.alignmentMultiplier);
        cohesion.multiplyScalar(this.cohesionMultiplier);

        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
    }

    separation(boids: Array<Boid>) {
        const steering = new THREE.Vector3();
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = this.position.distanceTo(boid.position);
            if (boid != this && distance < 3) {
                const difference = new THREE.Vector3()
                    .copy(this.position)
                    .sub(boid.position);
                difference.normalize();
                difference.divideScalar(distance);
                steering.add(difference);
                nearbyBoids++;
            }
        }

        if (nearbyBoids > 0) {
            steering.divideScalar(nearbyBoids);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }

        return steering;
    }

    align(boids: Array<Boid>) {
        const steering = new THREE.Vector3();
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = this.position.distanceTo(boid.position);
            if (boid != this && distance < this.perceptionRadius) {
                steering.add(boid.velocity);
                nearbyBoids++;
            }
        }

        if (nearbyBoids > 0) {
            steering.divideScalar(nearbyBoids);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }

        return steering;
    }

    cohesion(boids: Array<Boid>) {
        const steering = new THREE.Vector3();
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = this.position.distanceTo(boid.position);
            if (boid != this && distance < this.perceptionRadius) {
                steering.add(boid.position);
                nearbyBoids++;
            }
        }

        if (nearbyBoids > 0) {
            steering.divideScalar(nearbyBoids);
            steering.sub(this.position);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);
            steering.clampLength(0, this.maxForce);
        }

        return steering;
    }

    repulseFromEdges(radius: number) {
        const origin = new THREE.Vector3();
        const distance = this.position.distanceTo(origin);

        if (distance > radius) {
            // Bounce off of boundary
            const p = 2 * (this.velocity.dot(this.position) / (distance*distance));
            this.velocity = this.velocity.clone().sub(this.position.clone().multiplyScalar(p));

            // Steer toward center
            // const desired = this.position.clone().setLength(100).multiplyScalar(-1);
            // const steer = desired.sub(this.velocity);
            // this.acceleration.add(steer);
        }
    }
}
