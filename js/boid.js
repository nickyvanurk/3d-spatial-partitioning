class Boid {
    constructor(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
        this.velocity = new THREE.Vector3(0, 1, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }
}
