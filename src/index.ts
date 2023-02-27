import './style.css';
import { App } from './app/app';

const keys: { [key: string]: boolean } = {};

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

document.querySelector('#pauseBtn').addEventListener('click', togglePause);
document.querySelector('#resetBtn').addEventListener('click', app.reset);

window.addEventListener('dblclick', toggleFullscreen);
window.addEventListener('keydown', processEvents);
window.addEventListener('keyup', processEvents);
window.addEventListener('resize', resize);

function toggleFullscreen() {
    !document.fullscreenElement ? document.querySelector('body').requestFullscreen() : document.exitFullscreen();
}

function processEvents(event: KeyboardEvent) {
    keys['keydown'] = event.type === 'keydown';
    keys['keyup'] = event.type === 'keyup';
    keys[event.code] = event.type === 'keydown';

    if (keys.keydown) {
        if (keys.KeyP) togglePause();
        if (keys.KeyR) app.reset();
    }

    app.processEvents(keys);
}

function togglePause() {
    app.running = !app.running;
    (document.querySelector('#pauseBtn') as HTMLElement).innerText = app.running ? 'Pause' : 'Resume';
}

function resize() {
    app.resize();
}
