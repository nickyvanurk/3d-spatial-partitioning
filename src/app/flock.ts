import * as THREE from "three";

import { Boid } from './boid';
import { BoundingBox } from './octree';

export class Flock {
    size: number;
    region: BoundingBox;
    boids: Array<Boid> = [];
    particles: THREE.Points;

    constructor(size: number, region: BoundingBox) {
        this.size = size;
        this.region = region;

        this.generate();

        let vertices = new Float32Array(size * 3);
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
            boid.repulseFromEdges(this.region);
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
            let boid = new Boid(
                Math.random() * this.region.width  + this.region.position.x,
                Math.random() * this.region.height + this.region.position.y,
                Math.random() * this.region.depth  + this.region.position.z
            );
            this.boids.push(boid);
        }
    }
}