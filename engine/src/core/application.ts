import { Scene } from './scene';

type Config = {
    scene: Scene | Scene[];
};

export class Application {
    scene: Scene | Scene[];

    constructor(config: Config) {
        this.scene = config.scene;
    }
}
