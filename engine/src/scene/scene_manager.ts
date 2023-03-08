// import { Scene } from './scene';
// import { type Window } from '../core/window';

// export class SceneManager {
//     scenes: { [key: string]: Scene } = {};
//     current: Scene;

//     constructor(sceneConfig: typeof Scene | (typeof Scene)[]) {
//         if (!Array.isArray(sceneConfig)) {
//             sceneConfig = [sceneConfig];
//         }

//         for (const scene of sceneConfig.reverse()) {
//             this.current = new scene();
//             this.current.manager = this;
//             this.scenes[this.current.name] = this.current;
//         }

//         this.current.init();
//         this.current.preload();
//     }

//     fixedUpdate() {
//         this.current.fixedUpdate();
//     }

//     update() {
//         this.current.update();
//     }

//     switch(name: string) {
//         if (this.scenes[name]) {
//             this.current = this.scenes[name];
//             this.current.init();
//             this.current.preload();
//         }
//     }

//     public onWindowResize(window: Window) {
//         this.current.camera.aspect = window.width / window.height;
//         this.current.camera.updateProjectionMatrix();
//     }
// }
