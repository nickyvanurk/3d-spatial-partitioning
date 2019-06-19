const fpsLimit = 30;

const regionWidth = 300;
const regionHeight = 300;
const regionDepth = 300;
const regionCapacity = 4;

const particlesNum = 300;

const region = new BoundingBox(
    -regionWidth / 2,
    -regionHeight / 2,
    -regionDepth / 2,
    regionWidth,
    regionHeight,
    regionDepth
);
const octree = new Octree(region, regionCapacity);

let camera, scene, renderer, controls;

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    // create the Scene
    scene = new THREE.Scene();

    generateParticles(particlesNum);

    // region to query particles in
    const queryRegion = new BoundingBox(0, 0, 0, 156, 133, 165);
    renderCubeWireframe(scene, queryRegion, 'skyblue', 0.8);
    
    // query region for intersecintg particles
    let queryPoints = [];
    octree.query(queryRegion, queryPoints);
    renderParticles(scene, queryPoints, 'yellow', 3);

    // init the WebGL renderer and append it to the Dom
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    octree.show(scene);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

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
