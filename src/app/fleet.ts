import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { nextPowerOf2 } from "./helpers";

export class Fleet {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    size: number;
    bounds: number;
    width: number;
    capacity: number;
    geometry = new THREE.BufferGeometry();
    gpuCompute: GPUComputationRenderer;
    positionVariable: Variable;
    materialShader: THREE.Shader;

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, loadingManager: THREE.LoadingManager, size: number, bounds: number) {
        this.scene = scene; // TODO: Rework so this class doesn't require the scene?
        this.renderer = renderer; // TODO: Rework so this class doesn't require the renderer?
        this.size = size;
        this.bounds = bounds;
        this.width = nextPowerOf2(Math.sqrt(size));
        this.capacity = this.width * this.width;
        console.log(this.capacity)
        this.geometry = new THREE.BufferGeometry();

        new GLTFLoader(loadingManager).load('assets/models/fighter.glb', (gltf) => {
            const geo = (gltf.scene.children[0] as THREE.Mesh).geometry;
            const totalPositions = geo.getAttribute('position').count;
            const indicesPerShip = geo.index.count;
            
            const vertices = [], /*color = [],*/ reference = [], seeds = [], indices = [];
            const totalVertices = totalPositions * 3 * this.capacity;
            for (let i = 0; i < totalVertices; i++) {
                const bIndex = i % (totalPositions * 3);
                vertices.push(geo.getAttribute('position').array[bIndex]);
                // color.push(geo.getAttribute('color').array[bIndex]);
            }

            let r = Math.random();
            for (let i = 0; i < totalPositions * this.capacity; i++) {
                const bIndex = i % totalPositions;
                const ship = Math.floor(i / totalPositions);
                if (bIndex == 0) r = Math.random();
                const j = ~~ship;
                const x = (j % this.width) / this.width;
                const y = ~~(j / this.width) / this.width;
                reference.push(x, y);
                seeds.push(ship, r);
            }

            for (let i = 0; i < geo.index.array.length * this.capacity; i++) {
                const offset = Math.floor(i / geo.index.array.length) * totalPositions;
                indices.push(geo.index.array[i % geo.index.array.length] + offset);
            }

            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            // geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
            geo.setAttribute('reference', new THREE.BufferAttribute(new Float32Array(reference), 2));
            geo.setAttribute('seeds', new THREE.BufferAttribute(new Float32Array(seeds), 2));

            geo.setIndex(indices);
            geo.setDrawRange(0, indicesPerShip * this.size);

            this.geometry = geo;

            this.initComputeRenderer();
            this.initShips();
        });
    }

    reset() {
        // empty
    }

    initComputeRenderer() {
        this.gpuCompute = new GPUComputationRenderer(this.width, this.width, this.renderer);

        if (this.renderer.capabilities.isWebGL2 === false) {
            this.gpuCompute.setDataType( THREE.HalfFloatType );
        }

        const dtPosition = this.gpuCompute.createTexture();
        this.fillPositionTexture(dtPosition);

        const positionVariable = this.gpuCompute.addVariable('texturePosition', /* glsl */`
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
				vec4 tmpPos = texture2D(texturePosition, uv);
				vec3 position = tmpPos.xyz;
				gl_FragColor = vec4(position , 1.0);
            }
        `, dtPosition);
        this.gpuCompute.setVariableDependencies(positionVariable, [positionVariable]);
    
        positionVariable.wrapS = THREE.RepeatWrapping;
        positionVariable.wrapT = THREE.RepeatWrapping;

        this.positionVariable = positionVariable;

        const error = this.gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }
    }

    fillPositionTexture(texture: THREE.DataTexture) {
        const theArray = texture.image.data;
        const boundsHalf = this.bounds / 2;

        for (let k = 0, kl = theArray.length; k < kl; k += 4) {
            const x = Math.random() * this.bounds - boundsHalf;
            const y = Math.random() * this.bounds - boundsHalf;
            const z = Math.random() * this.bounds - boundsHalf;

            theArray[ k + 0 ] = x;
            theArray[ k + 1 ] = y;
            theArray[ k + 2 ] = z;
            theArray[ k + 3 ] = 1;
        }
    }

    initShips() {
        const material = new THREE.MeshStandardMaterial({
            flatShading: true,
            roughness: 1,
            metalness: 0,
        });

        material.onBeforeCompile = (shader) => {
            shader.uniforms.texturePosition = {value: null};
            shader.uniforms.size = {value: 0.01};

            let token = '#define STANDARD';
            let insert = /* glsl */`
                attribute vec4 reference;
                attribute vec4 seeds;
                uniform sampler2D texturePosition;
                uniform float size;
            `;
            shader.vertexShader = shader.vertexShader.replace(token, token + insert);

            token = '#include <begin_vertex>';
            insert = /* glsl */`
                vec4 tmpPos = texture2D(texturePosition, reference.xy);
            
                vec3 pos = tmpPos.xyz;
                vec3 newPosition = position;
                newPosition = mat3(modelMatrix) * newPosition;
                newPosition *= size + seeds.y * size * 0.2;

                newPosition += pos;

                vec3 transformed = vec3(newPosition);
            `;
            shader.vertexShader = shader.vertexShader.replace(token, insert);

            this.materialShader = shader;
        };

        const mesh = new THREE.Mesh(this.geometry, material);
        mesh.rotation.y = Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    update(dt: number) {
        dt;
    }

    render(alpha: number) {
        alpha;
        if (this.gpuCompute) {
            this.gpuCompute.compute();

            if (this.materialShader) {
                this.materialShader.uniforms['texturePosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
            }
        }
    }
}