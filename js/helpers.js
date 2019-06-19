class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function renderCubeWireframe(scene, region, color, opacity = 0.1) {
    var material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity
    });
    var geometry = new THREE.Geometry();

    const r = region;
    const p = region.position;

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

    return wireframe;
}

function renderBoids(scene, points, color = 'white', size = 2, name = 'boids') {
    const boidMaterial = new THREE.PointsMaterial({ color, size });
    const boidsGeometry = new THREE.Geometry();

    for (let i = 0; i < points.length; i++) {
        boidsGeometry.vertices.push(new THREE.Vector3(
            points[i].position.x,
            points[i].position.y,
            points[i].position.z
        ));
    }

    const boids = new THREE.Points(boidsGeometry, boidMaterial);
    boids.name = name;

    scene.add(boids);

    return scene.getObjectByName(boids.name);
}
