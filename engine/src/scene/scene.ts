interface IScene {
    name: string;

    init: () => void;
    preload: () => void;
    create: () => void;
    fixedUpdate: () => void;
    update: () => void;
}

export class Scene implements IScene {
    constructor(readonly name = 'default') {}

    init() {
        /* virtual method */
    }

    preload() {
        /* virtual method */
    }

    create() {
        /* virtual method */
    }

    fixedUpdate() {
        /* virtual method */
    }

    update() {
        /* virtual method */
    }
}
