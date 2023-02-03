export class App {
    keys: { [key: string]: boolean; };
    running: boolean;

    constructor() {
        window.addEventListener('keydown', this.processEvents.bind(this));
        window.addEventListener('keyup', this.processEvents.bind(this));

        this.reset();
    }

    reset() {
        this.keys = {};
        this.running = true;
    }

    processEvents(event: KeyboardEvent) {
        this.keys[event.code] = event.type === 'keydown';

        if (event.type === 'keydown') {
            if (this.keys['KeyP']) {
                this.running = !this.running;
            }

            if (this.keys['KeyR']) {
                this.reset();
            }
        }
    }

    update(dt: number) {
        // console.log(dt);
    }

    render(alpha: number) {
        // console.log(alpha);
    }
}