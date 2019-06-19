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

function renderParticles(scene, points, color = 'white', size = 2, name = 'particles') {
    const pointsGeometry = new THREE.Geometry();
    const particleMaterial = new THREE.PointsMaterial({ color, size });

    for (let i = 0; i < points.length; i++) {
        pointsGeometry.vertices.push(new THREE.Vector3(
            points[i].position.x,
            points[i].position.y,
            points[i].position.z
        ));
    }


    const particles = new THREE.Points(pointsGeometry, particleMaterial);
    console.log(name);
    particles.name = name;

    scene.add(particles);

    return scene.getObjectByName(particles.name);
}
