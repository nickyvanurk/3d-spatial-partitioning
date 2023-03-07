import './style.css';
import { Tree } from '../engine/src/data-structures/tree';

// import { App } from './app/app';

// const app = new App();
// app.run();

// import * as mln from 'merlin';
// import { Main } from './scenes';

// new mln.Application({
//     clearColor: 0x131a29,
//     scene: Main,
// });

class Scene {
    constructor(readonly name?: string) {}
}

const scenes = new Tree(new Scene('root'));

const secondNode = scenes.add(new Scene('second'));
scenes.add(new Scene('2.1'), secondNode);
scenes.add(new Scene('2.2'), secondNode);
scenes.add(new Scene('2.3'), secondNode);

const thirdNode = scenes.add(new Scene('third'));
scenes.add(new Scene('3.1'), thirdNode);
scenes.add(new Scene('3.2'), thirdNode);
scenes.add(new Scene('3.3'), thirdNode);

const fourhtNode = scenes.add(new Scene('fourth'));
scenes.add(new Scene('4.1'), fourhtNode);
scenes.add(new Scene('4.2'), fourhtNode);
scenes.add(new Scene('4.3'), fourhtNode);

scenes.traverse((scene: Scene) => {
    console.log(scene);
});

const found = scenes.find(thirdNode.data);
console.log(found.data);

console.log('deleting ', scenes.delete(found.data).data);

scenes.traverse((scene: Scene) => {
    console.log(scene);
});

// class Scenes {
//     value = new Tree(new Scene());
//     map: { [key: string]: TreeNode<Scene> } = {};

//     constructor() {
//         super(new Scene());
//         this.map['root'] = this.root;
//     }

//     add(name: string, parent = '') {
//         if (!parent) {
//             this.map[name] = super.add(new Scene(name));
//         } else {
//             this.map[name] = super.add(new Scene(name), this.map[parent]);
//         }
//     }

//     // create(name: string) {
//     //     const scene = new Scene(name);
//     //     //
//     // }

//     // find(name: string): Scene {
//     //     return new Scene(name);
//     //     //
//     // }
// }

// class Scene implements FSM
