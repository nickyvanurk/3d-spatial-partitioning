import * as mln from 'merlin';
import * as utils from '../app/utils';

export class Main extends mln.Scene {
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
        this.add.points(utils.createPointCloudSphere(1000, 6000, 2000, 12.5, 0xffffff));
        this.add.mesh('spaceship');
    }
}
