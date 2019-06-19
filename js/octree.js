class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Point {
    constructor(x, y, z) {
        this.position = new Vector3(x, y, z);
    }
}

class BoundingBox {
    constructor(x, y, z, width, height, depth) {
        this.position = new Vector3(x, y, z);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    contains(point) {
        const p = point.position;

        return p.x >= this.position.x && p.x < this.position.x + this.width &&
               p.y >= this.position.y && p.y < this.position.y + this.height &&
               p.z >= this.position.z && p.z < this.position.z + this.depth;
    }
}

class Octree {
    constructor(region, capacity) {
        this.region = region;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    insert(point) {
        if (!this.region.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }

            for (const child of this.children) {
                if (child.insert(point)) {
                    return true;
                }
            }
        }

        return false;
    }

    subdivide() {
        this.children = [];
        this.children.length = 8;

        for (let i = 0; i < this.children.length; i++) {
            const width = this.region.width / 2;
            const height = this.region.height / 2;
            const depth = this.region.depth / 2;

            const x = this.region.position.x + (i & 1) * width;
            const y = this.region.position.y + ((i >> 1) & 1) * height;
            const z = this.region.position.z + ((i >> 2) & 1) * depth;

            const region = new BoundingBox(x, y, z, width, height, depth);

            this.children[i] = new Octree(region, this.capacity);
        }

        this.divided = true;
    }

    // Used for octree visualisation; not essential
    show(scene) {
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.1
        });
        var geometry = new THREE.Geometry();

        const r = this.region;
        const p = this.region.position;

        geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x, p.y + r.height, p.z));

        geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x, p.y + r.height, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x, p.y + r.height, p.z));

        geometry.vertices.push(new THREE.Vector3(p.x, p.y + r.height, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z + r.depth));

        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y, p.z + r.depth));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z));
        geometry.vertices.push(new THREE.Vector3(p.x + r.width, p.y + r.height, p.z + r.depth));

        const wireframe = new THREE.Line(geometry, material);

        scene.add(wireframe);

        if (this.divided) {
            for (const child of this.children) {
                child.show(scene);
            }
        }   
    }
}
