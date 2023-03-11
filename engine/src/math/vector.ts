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

    sub(v: Vector3) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    subScalar(s: number) {
        return new Vector3(this.x - s, this.y - s, this.z - s);
    }

    subInPlace(v: Vector3) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    subScalarInPlace(s: number) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
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

    normalize() {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length, this.z / length);
    }

    normalizeInPlace() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    setLength(s: number) {
        return this.normalize().multiplyScalarInPlace(s);
    }

    setLengthInPlace(s: number) {
        this.normalizeInPlace();
        this.multiplyScalarInPlace(s);
    }

    limit(s: number) {
        if (this.length() > s) {
            this.setLengthInPlace(s);
        }
    }
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.set(x, y);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    copy(v: Vector2) {
        this.set(v.x, v.y);
    }

    add(v: Vector2) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    addScalar(s: number) {
        return new Vector2(this.x + s, this.y + s);
    }

    addInPlace(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    addScalarInPlace(s: number) {
        this.x += s;
        this.y += s;
    }

    sub(v: Vector2) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    subScalar(s: number) {
        return new Vector2(this.x - s, this.y - s);
    }

    subInPlace(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    subScalarInPlace(s: number) {
        this.x -= s;
        this.y -= s;
    }

    multiply(v: Vector2) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    multiplyScalar(s: number) {
        return new Vector2(this.x * s, this.y * s);
    }

    multiplyInPlace(v: Vector2) {
        this.x *= v.x;
        this.y *= v.y;
    }

    multiplyScalarInPlace(s: number) {
        this.x *= s;
        this.y *= s;
    }

    normalize() {
        const length = this.length();
        return new Vector3(this.x / length, this.y / length);
    }

    normalizeInPlace() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}
