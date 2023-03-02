import './style.css';
import { App } from './app/app';

const MS_PER_UPDATE = 1 / 25;
const app = new App();

let last = performance.now();
let lag = 0;

function loop() {
    if (app.running) {
        const now = performance.now();
        let delta = (now - last) / 1000;
        if (delta > 0.25) delta = 0.25;
        last = now;
        lag += delta;

        while (lag >= MS_PER_UPDATE) {
            app.update(MS_PER_UPDATE);
            lag -= MS_PER_UPDATE;
        }
    }

    app.render(lag / MS_PER_UPDATE, MS_PER_UPDATE);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
