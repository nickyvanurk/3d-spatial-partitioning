import './style.css';
// import { App } from './app/app';

// const app = new App();
// app.run();

import * as mln from 'merlin';
import { Main } from './scenes';

new mln.Application({
    clearColor: 0x131a29,
    scene: Main,
});
