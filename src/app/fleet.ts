import * as THREE from "three";
import { type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { nextPowerOf2 } from "./helpers";

import positionFs from './position.fs.glsl';
import velocityFs from './velocity.fs.glsl';

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
    velocityVariable: Variable;
    positionUniforms: {
        [uniform: string]: THREE.IUniform<number>;
    };
    velocityUniforms: {
        [uniform: string]: THREE.IUniform<number>;
    };

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, model: GLTF, size: number, bounds: number) {
        this.scene = scene; // TODO: Rework so this class doesn't require the scene?
        this.renderer = renderer; // TODO: Rework so this class doesn't require the renderer?
        this.size = size;
        this.bounds = bounds;
        this.width = nextPowerOf2(Math.sqrt(size));
        this.capacity = this.width * this.width;
        this.geometry = new THREE.BufferGeometry();

        const geo = (model.scene.children[0] as THREE.Mesh).geometry;
        const totalPositions = geo.getAttribute('position').count;
        const indicesPerShip = geo.index.count;
        
        const vertices = [], color = [], reference = [], seeds = [], indices = [];
        const totalVertices = totalPositions * 3 * this.capacity;

        // Filter alpha values from color array (Blender adds alpha channel after baking vertex colors).
        const colors = geo.getAttribute( 'color').array; 
        const newColors = [];
        for (let i = 0; i < colors.length; i++) {
            if (i % 4 === 0) continue;
            newColors.push(colors[i-1]);
        }

        for (let i = 0; i < totalVertices; i++) {
            const bIndex = i % (totalPositions * 3);
            vertices.push(geo.getAttribute('position').array[bIndex]);
            color.push(newColors[bIndex]);
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
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
        geo.setAttribute('reference', new THREE.BufferAttribute(new Float32Array(reference), 2));
        geo.setAttribute('seeds', new THREE.BufferAttribute(new Float32Array(seeds), 2));

        geo.setIndex(indices);
        geo.setDrawRange(0, indicesPerShip * this.size);

        this.geometry = geo;

        this.initComputeRenderer();
        this.initShips();
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
        const dtVelocity = this.gpuCompute.createTexture();
        this.fillPositionTexture(dtPosition);
        this.fillVelocityTexture(dtVelocity);

        this.positionVariable = this.gpuCompute.addVariable('texturePosition', positionFs, dtPosition);
        this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', velocityFs, dtVelocity);

        this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);
        this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);
    
        this.positionUniforms = this.positionVariable.material.uniforms;
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        this.positionUniforms['delta'] = {value: 0.0};
        this.velocityUniforms['delta'] = {value: 0.0};

        this.positionVariable.wrapS = THREE.RepeatWrapping;
        this.positionVariable.wrapT = THREE.RepeatWrapping;
        this.velocityVariable.wrapS = THREE.RepeatWrapping;
        this.velocityVariable.wrapT = THREE.RepeatWrapping;

        const error = this.gpuCompute.init();
        if (error !== null) {
            console.error(error);
        }
    }

    fillPositionTexture(texture: THREE.DataTexture) {
        const theArray = texture.image.data;
        const boundsHalf = this.bounds / 2;
        for (let i = 0, l = theArray.length; i < l; i += 4) {
            theArray[i + 0] = Math.random() * this.bounds - boundsHalf;
            theArray[i + 1] = Math.random() * this.bounds - boundsHalf;
            theArray[i + 2] = Math.random() * this.bounds - boundsHalf;
            theArray[i + 3] = 1;
        }
    }

    fillVelocityTexture(texture: THREE.DataTexture) {
        const theArray = texture.image.data;
        for (let i = 0, l = theArray.length; i < l; i += 4) {
            theArray[i + 0] = (Math.random() - 0.5) * 20;
            theArray[i + 1] = (Math.random() - 0.5) * 20;
            theArray[i + 2] = (Math.random() - 0.5) * 20;
            theArray[i + 3] = 1;
        }
    }

    initShips() {
        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            flatShading: true,
            roughness: 1,
            metalness: 0,
        });

        material.onBeforeCompile = (shader) => {
            shader.uniforms.texturePosition = {value: null};
            shader.uniforms.textureVelocity = {value: null};
            shader.uniforms.size = {value: 0.01};
            shader.uniforms.alpha = {value: 0.0};

            let token = '#define STANDARD';
            let insert = /* glsl */`
                attribute vec4 reference;
                attribute vec4 seeds;
                uniform sampler2D texturePosition;
                uniform sampler2D textureVelocity;
                uniform float size;
                uniform float alpha;
            `;
            shader.vertexShader = shader.vertexShader.replace(token, token + insert);

            token = '#include <begin_vertex>';
            insert = /* glsl */`
                vec4 tmpPos = texture2D(texturePosition, reference.xy);
                vec3 pos = tmpPos.xyz;
                float delta = tmpPos.w;
                vec3 tempVel = texture2D(textureVelocity, reference.xy).xyz;
                vec3 velocity = normalize(tempVel);
                vec3 newPosition = position;

                // tempVel * delta is the velocity added to the position in the positionVariable.
                // We can use it to get the old position and calculate the correct render position.
                pos = (pos) * alpha + (pos - tempVel * delta) * (1.0 - alpha);

                newPosition = mat3(modelMatrix) * newPosition;
                newPosition *= size;

                velocity.z *= -1.0;
                float xz = length(velocity.xz);
                float xyz = 1.0;
                float x = sqrt(1.0 - velocity.y * velocity.y);

                float cosry = velocity.x / xz;
                float sinry = velocity.z / xz;

                float cosrz = x / xyz;
                float sinrz = velocity.y / xyz;

                mat3 maty = mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
                mat3 matz = mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);
                
                newPosition = maty * matz * newPosition;
                newPosition += pos;

                vec3 transformed = vec3(newPosition);
            `;
            shader.vertexShader = shader.vertexShader.replace(token, insert);

            this.materialShader = shader;
        };

        const mesh = new THREE.Mesh(this.geometry, material);
        mesh.rotation.z -= Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    update(dt: number) {
        if (this.gpuCompute) {
            this.positionUniforms['delta'].value = dt;
            this.velocityUniforms['delta'].value = dt;

            this.gpuCompute.compute();

            if (this.materialShader) {
                this.materialShader.uniforms['texturePosition'].value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
                this.materialShader.uniforms['textureVelocity'].value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
            }
        }
    }

    render(alpha: number) {
        if (this.gpuCompute) {
            if (this.materialShader) {
                this.materialShader.uniforms['alpha'].value = alpha;
            }
        }
    }
}