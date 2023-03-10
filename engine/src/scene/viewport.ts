import { Vector2 } from '../math/vector';
import { Node } from './node';

export class Viewport extends Node {
    size: Vector2 = new Vector2(640, 360);
}
