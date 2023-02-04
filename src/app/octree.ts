//@ts-nocheck

import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

export class BoundingBox {
    position: THREE.Vector3;
    width: number;
    height: number;
    depth: number;

    constructor(x, y, z, width, height, depth) {
        this.position = new THREE.Vector3(x, y, z);
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.geometry = new THREE.BoxGeometry(width, height, depth);
        this.geometry.translate(x + width / 2, y + height / 2, z + depth / 2);
    }

    contains(point) {
        const p = point.position;

        return p.x >= this.position.x && p.x <= this.position.x + this.width &&
               p.y >= this.position.y && p.y <= this.position.y + this.height &&
               p.z >= this.position.z && p.z <= this.position.z + this.depth;
    }

    intersects(range) {
        const r = range.position;

        return !(r.x - r.width > this.position.x + this.width ||
               r.x + r.width < this.position.x - this.width ||
               r.y - r.height > this.position.y + this.height ||
               r.y + r.height < this.position.y - this.height ||
               r.z - r.depth > this.position.z + this.depth ||
               r.z + r.depth < this.position.z - this.depth);
    }
}

export class Octree {
    constructor(region, capacity) {
        this.region = region;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.region.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            for (const child of this.children) {
                if (child.insert(point)) {
                    return true;
                }
            }
        }

        return false;
    }

    subdivide() {
        this.children = [];
        this.children.length = 8;

        for (let i = 0; i < this.children.length; i++) {
            const width = this.region.width / 2;
            const height = this.region.height / 2;
            const depth = this.region.depth / 2;

            const x = this.region.position.x + (i & 1) * width;
            const y = this.region.position.y + ((i >> 1) & 1) * height;
            const z = this.region.position.z + ((i >> 2) & 1) * depth;

            const region = new BoundingBox(x, y, z, width, height, depth);

            this.children[i] = new Octree(region, this.capacity);
        }

        this.divided = true;
    }

    query(range, found) {
        if (!found) {
            found = [];
        }

        if (!this.region.intersects(range)) {
            return [];
        }

        for (const p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            for (const child of this.children) {
                child.query(range, found);
            }
        }
        
        return found;
    }

    getGeometries(geometries = []) {
        geometries.push(this.region.geometry);

        if (this.divided) {
            for (const child of this.children) {
                child.getGeometries(geometries);
            }
        }

        return geometries
    }

    buildGeometry() {
        const geometries = this.getGeometries();
        return mergeBufferGeometries(geometries);
    }
}
