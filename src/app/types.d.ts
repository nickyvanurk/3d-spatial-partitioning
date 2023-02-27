import { type AssetManager } from './asset_manager';

declare type Context = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    assets: AssetManager;
};
