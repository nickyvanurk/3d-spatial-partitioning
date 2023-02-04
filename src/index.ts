//@ts-nocheck
import './style.css';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { App } from './app/app';

const debug = window.location.hash === '#debug';
let stats;

if (debug) {
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

const MS_PER_UPDATE = 1 / 60;
const app = new App();

let last = performance.now();
let lag = 0;

function loop() {
    if (debug) stats.begin();
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
    if (debug) stats.end();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

document.querySelector('#pauseBtn').addEventListener('click', (event) => {
    app.running = !app.running;
    event.target.innerText = app.running ? 'Pause' : 'Resume';
});

document.querySelector('#resetBtn').addEventListener('click', () => {
    app.reset();
});