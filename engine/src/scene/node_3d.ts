import { Vector3 } from '../math';
import { Node } from './node';

export class Node3D extends Node {
    constructor(public position = new Vector3(), public rotation = new Vector3()) {
        super();
    }
}
