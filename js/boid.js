class Boid {
    constructor(x, y, z) {
        this.position = new Vector3(x, y, z);
        this.velocity = new Vector3(0, 0, 0);
        this.acceleration = new Vector3(0, 0, 0);
    }
}
