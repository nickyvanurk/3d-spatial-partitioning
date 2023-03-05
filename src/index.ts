import './style.css';
// import { App } from './app/app';

// const app = new App();
// app.run();

import * as Merlin from 'merlin';
import { Main } from './scenes';

new Merlin.Application({
    backgroundColor: 0x131a29,
    scene: Main,
});
