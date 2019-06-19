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
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

    flock(boids) {
        const alignment = this.align(boids);

        // this.acceleration.add(alignment);
        this.acceleration.copy(alignment);
    }

    align(boids) {
        const perceptionRadius = 200;

        let steering = new THREE.Vector3(0, 0, 0);
        let nearbyBoids = 0;

        for (const boid of boids) {
            const distance = (
                Math.pow(this.position.x - boid.position.x, 2) +
                Math.pow(this.position.y - boid.position.y, 2) +
                Math.pow(this.position.z - boid.position.z, 2)
            ) * 0.5;

            if (boid != this && distance < perceptionRadius) {
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
