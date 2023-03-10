import { Vector3 } from '../math';
import { Node } from './node';

export class Node3D extends Node {
    public position = new Vector3();
    public rotation = new Vector3();

    constructor() {
        super({ name: 'Node3D' });
    }
}
