function renderCubeWireframe(scene, region, color) {
    var material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.1
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
}
