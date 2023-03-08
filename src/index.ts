import './style.css';
import { Tree, TreeNode } from '../engine/src/data-structures/tree2';

// import { App } from './app/app';

// const app = new App();
// app.run();

// import * as mln from 'merlin';
// import { Main } from './scenes';

// new mln.Application({
//     clearColor: 0x131a29,
//     scene: Main,
// });

export class SceneNode<T> extends TreeNode<T> {
    constructor(data?: T, parent?: SceneNode<T> | TreeNode<T>) {
        super(data, parent);
    }

    public test() {
        console.log('test');
    }
}

export class SceneTree<T> extends Tree<T> {
    constructor() {
        super(new SceneNode('root' as T));
    }

    public add(data: T, parent = this.root) {
        return super.add(new SceneNode(data, parent)) as SceneNode<T>;
    }

    public find(data: T, parent = this.root) {
        return super.find(data, parent) as SceneNode<T>;
    }

    public traverse(cb: (data: SceneNode<T>) => void, parent = this.root) {
        super.traverse(cb, parent);
    }

    public delete(data: T, parent = this.root) {
        return super.delete(data, parent) as SceneNode<T>;
    }
}

const s = new SceneTree();

const secondScene = s.add('second');
s.add('2.1', secondScene);
s.add('2.2', secondScene);
s.add('2.3', secondScene);

const thirdScene = s.add('third');
s.add('3.1', thirdScene);
s.add('3.2', thirdScene);
s.add('3.3', thirdScene);

const fourthScene = s.add('fourth');
s.add('4.1', fourthScene);
s.add('4.2', fourthScene);
s.add('4.3', fourthScene);

s.traverse(scene => {
    scene.test();
    console.log(scene.data);
});

const found = s.find(thirdScene.data);
console.log(found);

const x = s.delete(found.data);
console.log('deleting ', x);
x.test();
