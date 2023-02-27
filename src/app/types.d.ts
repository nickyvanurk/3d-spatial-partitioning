import { type AssetManager } from './asset_manager';

declare type Keys = {
    keydown: boolean;
    keyup: boolean;
    [key: string]: boolean;
};

declare type Context = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    assets: AssetManager;
};
