interface IScene {
    name: string;

    create: () => void;
    fixedUpdate: () => void;
    update: () => void;
}

export class Scene implements IScene {
    name: string;

    constructor(name: string) {
        this.name = name;
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
