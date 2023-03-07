import './style.css';
import { ITree, ITreeNode, Tree } from '../engine/src/data-structures/tree';

// import { App } from './app/app';

// const app = new App();
// app.run();

// import * as mln from 'merlin';
// import { Main } from './scenes';

// new mln.Application({
//     clearColor: 0x131a29,
//     scene: Main,
// });

type SceneConfig = {
    name: string;
};

export class SceneNode<T> implements ITreeNode<T> {
    data: T;
    parent: ITreeNode<T>;
    children: Array<ITreeNode<T>>;

    constructor(data = { name: 'default' } as T, parent?: ITreeNode<T>) {
        if (typeof data !== 'object') {
            data = { name: data } as T;
        }

        this.data = data || undefined;
        this.parent = parent || undefined;
        this.children = [];
    }

    public test() {
        console.log('test');
    }
}

export class SceneTree<T = SceneConfig | string | number> implements ITree<T> {
    tree: Tree<T>;

    constructor(data = { name: 'root' } as T) {
        this.tree = new Tree(data, SceneNode);
    }

    add(data: T, parent = this.tree.root) {
        return this.tree.add(data, parent);
    }

    find(data: T, parent = this.tree.root) {
        return this.tree.find(data, parent);
    }

    traverse(cb: (data: SceneNode<T>) => void, parent = this.tree.root) {
        this.tree.traverse(cb, parent);
    }

    delete(data: T, parent = this.tree.root) {
        return this.tree.delete(data, parent);
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

console.log('deleting ', s.delete(found.data));
