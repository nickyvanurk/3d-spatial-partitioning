import * as THREE from 'three';
import { Node } from './node';

export class Camera3D extends Node {
    fov = 71;
    near = 0.05;
    far = 4000;
    current = false;

    camera: THREE.Camera;

    constructor() {
        super();

        //@TODO: Refactor aspect into:
        // Size2 viewport_size = get_viewport().get_camera_rest_size()
        // viewport_size.aspect()
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(this.fov, aspect, this.near, this.far);
    }
}
