import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class AssetManager {
    loadingManager: THREE.LoadingManager;
    loaders: { model: GLTFLoader };
    models: Map<string, object>;

    constructor(loadingManager: THREE.LoadingManager) {
        this.loadingManager = loadingManager;
        this.loaders = { model: new GLTFLoader(this.loadingManager) };
        this.models = new Map<string, object>();
    }

    loadModel(id: string, path: string) {
        this.loaders.model.load(path, (gltf) => {
            this.models.set(id, gltf);
        });
    }

    getModel(id: string) {
        if (!this.models.has(id)) {
            console.error("You're trying to use getModel before loading is complete");
            return;
        }
        return this.models.get(id) as GLTF;
    }
}
