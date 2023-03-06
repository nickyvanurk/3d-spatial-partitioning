import * as Merlin from 'merlin';
import * as Utils from '../app/helpers';

export class Main extends Merlin.Scene {
    constructor() {
        super('main');

        this.camera.far = 10000;
        this.camera.updateProjectionMatrix();
    }

    preload() {
        this.load.gltf('spaceship', 'assets/models/fighter.glb');

        this.load.on('progress', (percent: number) => {
            const loadingBar = document.querySelector('.bar') as HTMLElement;
            loadingBar.style.width = `${percent}%`;
        });

        this.load.on('done', () => {
            const loadingScreen = document.querySelector('.loadingScreen') as HTMLElement;
            loadingScreen.style.opacity = '0';
            loadingScreen.addEventListener('transitionend', () => {
                loadingScreen.style.zIndex = '-1';
            });
        });
    }

    create() {
        this.add.points(Utils.createPointCloudSphere(1000, 6000, 2000, 12.5, 0xffffff));
        this.add.mesh('spaceship');
    }
}
