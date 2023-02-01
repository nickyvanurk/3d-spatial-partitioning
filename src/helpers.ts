//@ts-nocheck

import * as THREE from 'three';

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
