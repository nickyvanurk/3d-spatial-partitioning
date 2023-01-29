//@ts-nocheck

import * as THREE from 'three';

export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export function renderCubeWireframe(scene, region, color, name, opacity = 0.1) {
    let points = [];

    const r = region;
    const p = region.position;

    points.push(new THREE.Vector3(p.x, p.y, p.z));
    points.push(new THREE.Vector3(p.x + r.width, p.y, p.z));
    points.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z));
    points.push(new THREE.Vector3(p.x, p.y + r.height, p.z));

    points.push(new THREE.Vector3(p.x, p.y, p.z));
    points.push(new THREE.Vector3(p.x, p.y, p.z + r.depth));
    points.push(new THREE.Vector3(p.x, p.y + r.height, p.z + r.depth));
    points.push(new THREE.Vector3(p.x, p.y + r.height, p.z));

    points.push(new THREE.Vector3(p.x, p.y + r.height, p.z + r.depth));
    points.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z + r.depth));
    points.push(new THREE.Vector3(p.x + r.width, p.y, p.z + r.depth));
    points.push(new THREE.Vector3(p.x, p.y, p.z + r.depth));

    points.push(new THREE.Vector3(p.x + r.width, p.y, p.z + r.depth));
    points.push(new THREE.Vector3(p.x + r.width, p.y, p.z));
    points.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z));
    points.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z + r.depth));

    const verticesNum = points.length * 3;
    let vertices = new Float32Array(verticesNum);

    for (let i = 0; i < points.length; i++) {
        vertices[i*3] = points[i].x;
        vertices[i*3 + 1] = points[i].y;
        vertices[i*3 + 2] = points[i].z;
    }

    const wireframeGeometry = new THREE.BufferGeometry();
    const wireframeMaterial = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity
    });

    wireframeGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const wireframe = new THREE.Line(wireframeGeometry, wireframeMaterial);
    wireframe.name = name;

    scene.add(wireframe);

    return wireframe;
}

export function renderBoids(scene, points, color = 'white', size = 2, name = 'boids') {
    const verticesNum = points.length * 3;
    let vertices = new Float32Array(verticesNum);

    for (let i = 0; i < points.length; i++) {
        vertices[i*3] = points[i].position.x;
        vertices[i*3 + 1] = points[i].position.y;
        vertices[i*3 + 2] = points[i].position.z;
    }

    const boidsGeometry = new THREE.BufferGeometry();
    const boidsMaterial = new THREE.PointsMaterial({ color, size });

    boidsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const boids = new THREE.Points(boidsGeometry, boidsMaterial);
    boids.name = name;

    scene.add(boids);

    return scene.getObjectByName(boids.name);
}
