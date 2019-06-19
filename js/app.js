const fpsLimit = 30;

const regionWidth = 300;
const regionHeight = 300;
const regionDepth = 300;
const regionCapacity = 4;

const boidsNum = 200;

const speed = 10;

const region = new BoundingBox(
    -regionWidth / 2,
    -regionHeight / 2,
    -regionDepth / 2,
    regionWidth,
    regionHeight,
    regionDepth
);
const octree = new Octree(region, regionCapacity);

let camera,
scene,
renderer,
controls,
boids,
queryPoints,
queryRegion,
queryRegionWireframe,
queryRegionBoids;

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 400;

    // create the Scene
    scene = new THREE.Scene();

    boids = generateBoids(boidsNum);

    // region to query boids in
    queryRegion = new BoundingBox(0, 0, 0, 156, 133, 165);
    queryRegionWireframe = renderCubeWireframe(
        scene,
        queryRegion,
        'skyblue',
        0.8
    );

    // query region for intersecting boids
    queryPoints = [];
    octree.query(queryRegion, queryPoints);
    queryRegionBoids = renderBoids(
        scene,
        queryPoints,
        'yellow',
        4,
        'queryRegionBoids'
    );

    // init the WebGL renderer and append it to the Dom
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    octree.show(scene);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener("keydown", onWindowKeyDown, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowKeyDown(event) {
    const keyCode = event.which;

    if (keyCode == 87) {
        queryRegion.position.y += speed;
    } else if (keyCode == 83) {
        queryRegion.position.y -= speed;
    } else if (keyCode == 65) {
        queryRegion.position.x -= speed;
    } else if (keyCode == 68) {
        queryRegion.position.x += speed;
    } else if (keyCode == 32) {
        queryRegion.position.set(0, 0, 0);
    } else if (keyCode == 81) {
        queryRegion.position.z += speed;
    } else if (keyCode == 69) {
        queryRegion.position.z -= speed;
    }

    queryPoints = [];
    octree.query(queryRegion, queryPoints);

    queryRegionWireframe.position.x = queryRegion.position.x;
    queryRegionWireframe.position.y = queryRegion.position.y;
    queryRegionWireframe.position.z = queryRegion.position.z;
};

function update() {
    controls.update();

    for (const boid of boids) {
        boid.wrapOnEdges(region);
        boid.flock(boids);
        boid.update();
    }
}

function render() {
    scene.remove(scene.getObjectByName('boids'));
    scene.remove(scene.getObjectByName('queryRegionBoids'));

    renderBoids(scene, boids);
    queryRegionBoids = renderBoids(
        scene,
        queryPoints,
        'yellow',
        4,
        'queryRegionBoids'
    );

    renderer.render(scene, camera);
}

function generateBoids(boidsNum) {
    let boids = [];

    for (let i = 0; i < boidsNum; i++) {
        let boid = new Boid(
            parseInt(Math.random() * regionWidth + region.position.x),
            parseInt(Math.random() * regionHeight  + region.position.y),
            parseInt(Math.random() * regionDepth  + region.position.z)
        );

        boids.push(boid);

        octree.insert(boid);
    }

    renderBoids(scene, boids);

    return boids;
}

function animate() {
    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / fpsLimit);

    update();
    render();
}

init();
animate();
