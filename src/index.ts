//@ts-nocheck

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { BoundingBox, Octree } from './octree';
import { Boid } from './boid';
import { renderBoids, renderCubeWireframe } from './helpers';

const fpsLimit = 30;

const regionWidth = 400;
const regionHeight = 400;
const regionDepth = 400;
const regionCapacity = 8;

const boidsNum = 400;
const boidBoundBoxRange = 20;

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
    perceptionRadius: 30,
    alignment: 1,
    separation: 1,
    cohesion: 1,
    maxSpeed: 2,
    maxForce: 0.2,
    octreeWireframe: true,
};

let gui = new dat.GUI({ height : 5 * 32 - 1, width: 310 });

const keys = {};
let input = new THREE.Vector3();

let wireframe;

const canvas = document.querySelector('canvas.webgl');

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 900);
    camera.position.y = 300;
    camera.position.z = 600;

    // create the Scene
    scene = new THREE.Scene();

    boids = generateBoids(boidsNum);

    // init the WebGL renderer and append it to the Dom
    renderer = new THREE.WebGLRenderer({ canvas, anantialias: true });
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

    gui.add(uiObj, 'perceptionRadius', 0, 1000, 10);
    gui.add(uiObj, 'alignment', 0, 5, 0.1);
    gui.add(uiObj, 'separation', 0, 5, 0.1);
    gui.add(uiObj, 'cohesion', 0, 5, 0.1);
    gui.add(uiObj, 'maxSpeed', 0, 10, 0.1);
    gui.add(uiObj, 'maxForce', 0, 1, 0.02);
    gui.add(uiObj, 'octreeWireframe');

    wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(octree.buildGeometry()), new THREE.LineBasicMaterial({ color: 0xd1cfc8, transparent: true, opacity: 0.1 }));
    scene.add(wireframe);
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
    controls.update();

    octree = new Octree(region, regionCapacity);

    for (const boid of boids) {
        octree.insert(boid);
    }

    for (let i = 0; i < boids.length; i++) {
        let boid = boids[i];

        boid.alignmentMultiplier = uiObj.alignment;
        boid.separationMultiplier = uiObj.separation;
        boid.cohesionMultiplier = uiObj.cohesion;
        boid.maxSpeed = uiObj.maxSpeed;
        boid.maxForce = uiObj.maxForce;

        const boidBoundBox = new BoundingBox(
            boid.position.x - boidBoundBoxRange / 2,
            boid.position.y - boidBoundBoxRange / 2,
            boid.position.z - boidBoundBoxRange / 2,
            boidBoundBoxRange,
            boidBoundBoxRange,
            boidBoundBoxRange
        );
        
        const nearbyBoids = octree.query(boidBoundBox);

        boid.wrapOnEdges(region);
        boid.flock(nearbyBoids);
        boid.update();
    }
}

function render() {
    removeObjects('boids');

    renderBoids(scene, boids);

    if (uiObj.octreeWireframe) {
        wireframe.geometry = new THREE.EdgesGeometry(octree.buildGeometry());
    }

    wireframe.visible = uiObj.octreeWireframe;

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

    renderBoids(scene, boids);

    return boids;
}

function removeObjects(name) {
    const objects = [];
    scene.traverse((child) => {
        if (child.name === name) {
            objects.push(child);
        }
    });

    for (const object of objects) {
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
    }
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / fpsLimit);

    update();
    render();
}

init();
animate();
