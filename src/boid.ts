//@ts-nocheck

import * as THREE from 'three';

export class Boid {
    prevPosition: THREE.Vector3;
    position: THREE.Vector3;
    velocity: THREE.Vector3;

    constructor(x: number, y: number, z: number) {
        this.prevPosition = new THREE.Vector3(x, y, z);
        this.position = this.prevPosition;
        this.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 120,
            (Math.random() - 0.5) * 120,
        );
        this.acceleration = new THREE.Vector3();

        this.maxForce = 30;
        this.maxSpeed = 120;

        this.separationMultiplier = 4.5;
        this.alignmentMultiplier = 0.1;
        this.cohesionMultiplier = 0.1;

        this.perceptionRadius = 30;
    }

    update(dt: number) {
        this.prevPosition = this.position.clone();
        this.velocity.add(this.acceleration.clone().multiplyScalar(dt));
        this.position.add(this.velocity.clone().multiplyScalar(dt));
        this.velocity.clampLength(0, this.maxSpeed);
        this.acceleration.set(0, 0, 0);
    }

    flock(boids) {
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

    separation(boids) {
        let steering = new THREE.Vector3();
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = this.position.distanceTo(boid.position);
            if (boid != this && distance < 3) {
                let difference = new THREE.Vector3()
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
        };

        return steering;
    }

    align(boids) {
        let steering = new THREE.Vector3();
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
        };

        return steering;
    }

    cohesion(boids) {
        let steering = new THREE.Vector3();
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
        };

        return steering;
    }

    repulseFromEdges(region) {
        let desired = new THREE.Vector3();

        if (this.position.x > (region.position.x + region.width) - 10) {
            desired = new THREE.Vector3(-this.maxSpeed, this.velocity.y, this.velocity.z);
        } else if (this.position.x < region.position.x + 10) {
            desired = new THREE.Vector3(this.maxSpeed, this.velocity.y, this.velocity.z);
        }

        if (this.position.y > (region.position.y + region.height) - 10) {
            desired = new THREE.Vector3(this.velocity.x, -this.maxSpeed, this.velocity.z);
        } else if (this.position.y < region.position.y + 10) {
            desired = new THREE.Vector3(this.velocity.x, this.maxSpeed, this.velocity.z);
        }

        if (this.position.z > (region.position.z + region.depth) - 10) {
            desired = new THREE.Vector3(this.velocity.x, this.velocity.y, -this.maxSpeed);
        } else if (this.position.z < region.position.z + 10) {
            desired = new THREE.Vector3(this.velocity.x, this.velocity.y, this.maxSpeed);
        }

        if (desired.length() > 0) {
            let steer = desired.sub(this.velocity);
            this.acceleration.add(steer);
        }
    }
}
