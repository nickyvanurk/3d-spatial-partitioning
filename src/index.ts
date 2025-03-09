//@ts-nocheck

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { BoundingBox, Octree } from './octree';
import { Boid } from './boid';

const debug = true;

let stats;

const regionWidth = 400;
const regionHeight = 400;
const regionDepth = 400;
const regionCapacity = 8;

const boidsNum = 400;

const region = new BoundingBox(
    -regionWidth / 2,
    -regionHeight / 2,
    -regionDepth / 2,
    regionWidth,
    regionHeight,
    regionDepth
);
let octree = new Octree(region, regionCapacity);

let camera,
scene,
renderer,
controls,
boids;

let uiObj = {
    perceptionRadius: 50,
    separation: 4.5,
    alignment: 0.1,
    cohesion: 0.1,
    maxSpeed: 1,
    maxForce: 0.25,
    octreeWireframe: true,
};

let gui = new dat.GUI({ height : 5 * 32 - 1, width: 310 });

const keys = {};
let input = new THREE.Vector3();

let wireframe;
let particles;

const canvas = document.querySelector('canvas.webgl');

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 900);
    camera.position.y = 300;
    camera.position.z = 600;

    // create the Scene
    scene = new THREE.Scene();

    boids = generateBoids(boidsNum);
    particles = generateParticles(boids);
    scene.add(particles);

    // init the WebGL renderer
    renderer = new THREE.WebGLRenderer({ canvas, anantialias: true });
    renderer.setClearColor(0x131A29);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxDistance = 650;

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('dblclick', onDoubleClickEvent, false);
    window.addEventListener("keydown", onKeyEvent, false);
    window.addEventListener("keyup", onKeyEvent, false);

    wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(octree.buildGeometry()), new THREE.LineBasicMaterial({ color: 0xd1cfc8, transparent: true, opacity: 0.1 }));
    scene.add(wireframe);

    gui.add(uiObj, 'perceptionRadius', 0, 400, 10);
    gui.add(uiObj, 'alignment', 0, 5, 0.1);
    gui.add(uiObj, 'separation', 0, 5, 0.1);
    gui.add(uiObj, 'cohesion', 0, 5, 0.1);
    gui.add(uiObj, 'maxSpeed', 0, 10, 0.1);
    gui.add(uiObj, 'maxForce', 0, 1, 0.02);
    gui.add(uiObj, 'octreeWireframe').onChange(() => wireframe.visible = uiObj.octreeWireframe);
    gui.close();

    if (!debug) {
        gui.hide();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onDoubleClickEvent() {
    if (!document.fullscreenElement) {
        document.querySelector('body').requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function onKeyEvent(event) {
    keys[event.code] = event.type === 'keydown';
    input.x = keys.KeyA ? -1 : keys.KeyD ?  1 : 0;
    input.y = keys.KeyQ ?  1 : keys.KeyE ? -1 : 0;
    input.z = keys.KeyW ? -1 : keys.KeyS ?  1 : 0;
    input = input.normalize();
};

function update() {
    octree = new Octree(region, regionCapacity);

    for (const boid of boids) {
        octree.insert(boid);
    }

    for (let i = 0; i < boids.length; i++) {
        let boid = boids[i];

        boid.perceptionRadius = uiObj.perceptionRadius;
        boid.alignmentMultiplier = uiObj.alignment;
        boid.separationMultiplier = uiObj.separation;
        boid.cohesionMultiplier = uiObj.cohesion;
        boid.maxSpeed = uiObj.maxSpeed;
        boid.maxForce = uiObj.maxForce;

        const boidBoundBox = new BoundingBox(
            boid.position.x - uiObj.perceptionRadius / 2,
            boid.position.y - uiObj.perceptionRadius / 2,
            boid.position.z - uiObj.perceptionRadius / 2,
            uiObj.perceptionRadius,
            uiObj.perceptionRadius,
            uiObj.perceptionRadius
        );

        const nearbyBoids = octree.query(boidBoundBox);

        boid.flock(nearbyBoids);
        boid.repulseFromEdges(region);
        boid.update();
    }
}

function render() {
    for (let i = 0; i < boids.length; i++) {
        particles.geometry.attributes.position.array[i*3] = boids[i].position.x;
        particles.geometry.attributes.position.array[i*3 + 1] = boids[i].position.y;
        particles.geometry.attributes.position.array[i*3 + 2] = boids[i].position.z;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    if (uiObj.octreeWireframe) {
        wireframe.geometry.dispose();
        wireframe.geometry = new THREE.EdgesGeometry(octree.buildGeometry());
    }

    renderer.render(scene, camera);
}

function generateBoids(boidsNum) {
    let boids = [];

    for (let i = 0; i < boidsNum; i++) {
        let boid = new Boid(
            parseInt(Math.random() * regionWidth + region.position.x),
            parseInt(Math.random() * regionHeight  + region.position.y),
            parseInt(Math.random() * regionDepth  + region.position.z)
        );

        boids.push(boid);
        octree.insert(boid);
    }

    return boids;
}

function generateParticles(points, color = 'white', size = 2) {
    let vertices = new Float32Array(points.length * 3);

    for (let i = 0; i < points.length; i++) {
        vertices[i*3] = points[i].position.x;
        vertices[i*3 + 1] = points[i].position.y;
        vertices[i*3 + 2] = points[i].position.z;
    }

    const boidsGeometry = new THREE.BufferGeometry();
    const boidsMaterial = new THREE.PointsMaterial({ color, size });
    boidsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    return new THREE.Points(boidsGeometry, boidsMaterial);
}

let paused = false;

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    if (!paused) {
        update();
    }

    render();
}

init();
animate();

document.querySelector('#pauseBtn').addEventListener('click', (event) => {
    if (!paused) {
        paused = true;
        event.target.innerText = 'Resume';

    } else {
        paused = false;
        event.target.innerText = 'Pause';
    }
});

document.querySelector('#resetBtn').addEventListener('click', () => {
        boids = generateBoids(boidsNum);
});
