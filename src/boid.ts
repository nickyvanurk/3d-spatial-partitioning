//@ts-nocheck

import * as THREE from 'three';

export class Boid {
    constructor(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize();
        this.velocity.setLength(Math.random() * (+5 - +2) + +2);
        this.acceleration = new THREE.Vector3(0, 0, 0);

        this.maxForce = 0.2;
        this.maxSpeed = 4;

        this.separationMultiplier = 1.5;
        this.alignmentMultiplier = 1;
        this.cohesionMultiplier = 1;

        this.perceptionRadius = 30;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.velocity.clampLength(0, this.maxSpeed);
    }

    flock(boids) {
        this.acceleration.set(0, 0, 0);

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
        let steering = new THREE.Vector3(0, 0, 0);
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
        let steering = new THREE.Vector3(0, 0, 0);
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
        let steering = new THREE.Vector3(0, 0, 0);
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
            steer.clampLength(0, this.maxForce);
            this.acceleration.add(steer);
        }
    }

    wrapOnEdges(region) {
        if (this.position.x > region.position.x + region.width) {
            this.position.x = region.position.x;
        } else 
        if (this.position.x < region.position.x) {
            this.position.x = region.position.x + region.width;
        }

        if (this.position.y > region.position.y + region.height) {
            this.position.y = region.position.y;
        } else if (this.position.y < region.position.y) {
            this.position.y = region.position.y + region.height;
        }

        if (this.position.z > region.position.z + region.depth) {
            this.position.z = region.position.z;
        } else if (this.position.z < region.position.z) {
            this.position.z = region.position.z + region.depth;
        }
    }
}
