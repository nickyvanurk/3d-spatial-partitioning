class Boid {
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

        this.alignmentMultiplier = 1;
        this.separationMultiplier = 1;
        this.cohesionMultiplier = 1;

        this.perceptionRadius = 300;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);

        if (this.velocity.length() > this.maxSpeed)
            this.velocity.setLength(this.maxSpeed);
    }

    flock(boids) {
        this.acceleration.set(0, 0, 0);

        const alignment = this.align(boids);
        const separation = this.separation(boids);
        const cohesion = this.cohesion(boids);

        alignment.multiplyScalar(this.alignmentMultiplier);
        separation.multiplyScalar(this.separationMultiplier);
        cohesion.multiplyScalar(this.cohesionMultiplier);

        this.acceleration.add(alignment);
        this.acceleration.add(separation);
        this.acceleration.add(cohesion);
    }

    align(boids) {
        let steering = new THREE.Vector3(0, 0, 0);
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = (
                Math.pow(this.position.x - boid.position.x, 2) +
                Math.pow(this.position.y - boid.position.y, 2) +
                Math.pow(this.position.z - boid.position.z, 2)
            ) * 0.5;

            if (boid != this && distance < this.perceptionRadius) {
                steering.add(boid.velocity);
                nearbyBoids++;
            }
        }

        if (nearbyBoids > 0) {
            steering.divideScalar(nearbyBoids);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);

            if (steering.length() > this.maxForce)
                steering.setLength(this.maxForce);
        };

        return steering;
    }

    separation(boids) {
        let steering = new THREE.Vector3(0, 0, 0);
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = (
                Math.pow(this.position.x - boid.position.x, 2) +
                Math.pow(this.position.y - boid.position.y, 2) +
                Math.pow(this.position.z - boid.position.z, 2)
            ) * 0.5;

            if (boid != this && distance < this.perceptionRadius) {
                let difference = new THREE.Vector3()
                    .copy(this.position)
                    .sub(boid.position);

                difference.divideScalar(distance);

                steering.add(difference);

                nearbyBoids++;
            }
        }

        if (nearbyBoids > 0) {
            steering.divideScalar(nearbyBoids);
            steering.setLength(this.maxSpeed);
            steering.sub(this.velocity);

            if (steering.length() > this.maxForce)
                steering.setLength(this.maxForce);
        };

        return steering;
    }

    cohesion(boids) {
        let steering = new THREE.Vector3(0, 0, 0);
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = (
                Math.pow(this.position.x - boid.position.x, 2) +
                Math.pow(this.position.y - boid.position.y, 2) +
                Math.pow(this.position.z - boid.position.z, 2)
            ) * 0.5;

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

            if (steering.length() > this.maxForce)
                steering.setLength(this.maxForce);
        };

        return steering;
    }
    
    wrapOnEdges(region) {
        if (this.position.x > region.position.x + region.width) {
            this.position.x = region.position.x;
        } else if (this.position.x < region.position.x) {
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
