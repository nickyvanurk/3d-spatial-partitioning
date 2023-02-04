import * as THREE from "three";

import { Boid } from './boid';

export class Flock {
    size: number;
    boids: Array<Boid> = [];
    particles: THREE.Points;
    radius: number;

    constructor(size: number, radius: number) {
        this.size = size;
        this.radius = radius;

        this.generate();

        const vertices = new Float32Array(size * 3);
        for (let i = 0; i < size; i++) {
            const boid = this.boids[i];
            vertices[i*3 + 0] = boid.position.x;
            vertices[i*3 + 1] = boid.position.y;
            vertices[i*3 + 2] = boid.position.z;
        }
    
        const boidsGeometry = new THREE.BufferGeometry();
        const boidsMaterial = new THREE.PointsMaterial({ color: 'white', size: 2 });
        boidsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this.particles = new THREE.Points(boidsGeometry, boidsMaterial);


    }

    reset() {
        this.boids = [];
        this.generate();
    }

    update(dt: number) {
        for (const boid of this.boids) {
            boid.flock(this.boids);
            boid.repulseFromEdges(this.radius);
            boid.update(dt);
        }
    }

    render(alpha: number) {
        for (let i = 0; i < this.boids.length; i++) {
            const pos = this.boids[i].position.clone();
            const prevPos = this.boids[i].prevPosition.clone();
            const renderPos = pos.multiplyScalar(alpha).add(prevPos.multiplyScalar(1 - alpha));
            this.particles.geometry.attributes.position.setXYZ(i, renderPos.x, renderPos.y, renderPos.z);
        }

        this.particles.geometry.attributes.position.needsUpdate = true;
    }

    generate() {        
        for (let i = 0; i < this.size; i++) {
            const boid = new Boid(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
            );
            boid.position.normalize();
            boid.position.multiplyScalar(this.radius);
            this.boids.push(boid);
        }
    }
}