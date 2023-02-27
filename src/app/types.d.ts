import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

declare type Keys = {
    keydown: boolean;
    keyup: boolean;
    [key: string]: boolean;
};

declare type Context = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    models: Map<string, GLTF>;
};
