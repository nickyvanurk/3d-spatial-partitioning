import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { nextPowerOf2 } from "./helpers";

export class Fleet {
    size: number;
    width: number;
    capacity: number;
    geometry = new THREE.BufferGeometry();

    constructor(loadingManager: THREE.LoadingManager, size: number) {
        this.size = size;
        this.width = nextPowerOf2(Math.sqrt(size));
        this.capacity = this.width * this.width;
        this.geometry = new THREE.BufferGeometry();

        new GLTFLoader(loadingManager).load('assets/models/fighter.glb', (gltf) => {
            const geo = (gltf.scene.children[0] as THREE.Mesh).geometry;
            const totalPositions = geo.getAttribute('position').count;
            const tWidth = nextPowerOf2(totalPositions);
            
            const vertices = [], /*color = [],*/ reference = [], seeds = [], indices = [];
            const totalVertices = totalPositions * 3 * this.capacity;
            for (let i = 0; i < totalVertices; i++) {
                const bIndex = i % (totalPositions * 3);
                vertices.push(geo.getAttribute('position').array[bIndex]);
                // color.push(geo.getAttribute('color').array[bIndex]);
            }

            let r = Math.random();
            for (let i = 0; i < totalPositions * this.capacity; i++) {
                const bIndex = i % (totalPositions * 3);
                const ship = Math.floor(i / totalPositions);
                if (bIndex === 0) r = Math.random();
                const j = ~~ship;
                const x = (j % this.width) / this.width;
                const y = ~~(j / this.width) / this.width;
                reference.push(x, y, bIndex / tWidth);
                seeds.push(ship, r, Math.random(), Math.random());
            }

            for (let i = 0; i < geo.index.array.length * this.capacity; i++) {
                const offset = Math.floor(i / geo.index.array.length) * totalPositions;
                indices.push(geo.index.array[i % geo.index.array.length] + offset);
            }

            this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            // this.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
            this.geometry.setAttribute('reference', new THREE.BufferAttribute(new Float32Array(reference), 3));
            this.geometry.setAttribute('seeds', new THREE.BufferAttribute(new Float32Array(seeds), 3));

            geo.setIndex(indices);

            console.log(this.geometry);
        });
    }

    reset() {
        // empty
    }

    update(dt: number) {
        dt;
    }

    render(alpha: number) {
        alpha;
    }
}