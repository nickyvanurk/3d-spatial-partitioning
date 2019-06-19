const fpsLimit = 30;

const regionWidth = 300;
const regionHeight = 300;
const regionDepth = 300;
const regionCapacity = 4;

const particlesNum = 300;

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
queryPoints,
queryRegion,
queryRegionWireframe,
queryRegionparticles;

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    // create the Scene
    scene = new THREE.Scene();

    generateParticles(particlesNum);

    // region to query particles in
    queryRegion = new BoundingBox(0, 0, 0, 156, 133, 165);
    queryRegionWireframe = renderCubeWireframe(
        scene,
        queryRegion,
        'skyblue',
        0.8
    );

    // query region for intersecintg particles
    queryPoints = [];
    octree.query(queryRegion, queryPoints);
    queryRegionparticles = renderParticles(
        scene,
        queryPoints,
        'yellow',
        4,
        'queryRegionParticles'
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

    scene.remove(queryRegionparticles);

    queryRegionparticles = renderParticles(
        scene,
        queryPoints,
        'yellow',
        4,
        'queryRegionParticles'
    );
};

function update() {
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function generateParticles(particles) {
    let points = [];

    for (let i = 0; i < particles; i++) {
        let point = new Point(
            parseInt(Math.random() * regionWidth + region.position.x),
            parseInt(Math.random() * regionHeight  + region.position.y),
            parseInt(Math.random() * regionDepth  + region.position.z)
        );

        points.push(point);

        octree.insert(point);
    }

    renderParticles(scene, points);
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
