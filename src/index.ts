import './style.css';
import { App } from './app/app';

const keys: { [key: string]: boolean; } = {};

const MS_PER_UPDATE = 1 / 60;
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

    app.render(lag / MS_PER_UPDATE);
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

document.querySelector('#pauseBtn').addEventListener('click', (event) => {
    app.running = !app.running;
    (event.target as HTMLElement).innerText = app.running ? 'Pause' : 'Resume';
});

document.querySelector('#resetBtn').addEventListener('click', () => {
    app.reset();
});

window.addEventListener('keydown', processEvents);
window.addEventListener('keyup', processEvents);
window.addEventListener('resize', resize);
window.addEventListener('dblclick', toggleFullscreen);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.querySelector('body').requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function processEvents(event: KeyboardEvent) {
    keys['keydown'] = event.type === 'keydown';
    keys['keyup'] = event.type === 'keyup';
    keys[event.code] = event.type === 'keydown';

    if (keys.keydown) {
        if (keys.KeyP) app.running = !app.running;
        if (keys.KeyR) app.reset();
    }

    app.processEvents(keys);
}

function resize() {
    app.resize();
}