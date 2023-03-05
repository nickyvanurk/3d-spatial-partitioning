export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {
        this.set(x, y, z);
    }

    set(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy(v: Vector3) {
        this.set(v.x, v.y, v.z);
    }

    add(v: Vector3) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    addScalar(s: number) {
        return new Vector3(this.x + s, this.y + s, this.z + s);
    }

    addInPlace(v: Vector3) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    addScalarInPlace(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;
    }

    multiply(v: Vector3) {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    multiplyScalar(s: number) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    multiplyInPlace(v: Vector3) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
    }

    multiplyScalarInPlace(s: number) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }
}
