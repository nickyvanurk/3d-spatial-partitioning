const fpsLimit = 30;

const regionWidth = 400;
const regionHeight = 400;
const regionDepth = 400;
const regionCapacity = 8;

const boidsNum = 400;
const boidBoundBoxRange = 20;

const speed = 10;

const region = new BoundingBox(
    -regionWidth / 2,
    -regionHeight / 2,
    -regionDepth / 2,
    regionWidth,
    regionHeight,
    regionDepth
);
let octree = new Octree(region, regionCapacity);

let camera,
scene,
renderer,
controls,
boids,
queryPoints,
queryRegion,
queryRegionWireframe,
queryRegionBoids;

let uiObj = {
    perceptionRadius: 30,
    alignment: 1,
    separation: 1,
    cohesion: 1,
    maxSpeed: 2,
    maxForce: 0.2,
    octreeWireframe: true,
    regionWireframe: true,
};
let gui = new dat.GUI({ height : 5 * 32 - 1, width: 310 });

function init() {
    // create the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 300;
    camera.position.z = 600;

    // create the Scene
    scene = new THREE.Scene();

    boids = generateBoids(boidsNum);

    // region to query boids in
    queryRegion = new BoundingBox(0, 0, 0, 156, 133, 165);
    queryRegionWireframe = renderCubeWireframe(
        scene,
        queryRegion,
        'skyblue',
        'regionWireframe',
        0.8
    );

    // query region for intersecting boids
    queryPoints = octree.query(queryRegion);
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

    gui.add(uiObj, 'perceptionRadius', 0, 1000, 10);
    gui.add(uiObj, 'alignment', 0, 5, 0.1);
    gui.add(uiObj, 'separation', 0, 5, 0.1);
    gui.add(uiObj, 'cohesion', 0, 5, 0.1);
    gui.add(uiObj, 'maxSpeed', 0, 10, 0.1);
    gui.add(uiObj, 'maxForce', 0, 1, 0.02);
    gui.add(uiObj, 'octreeWireframe');
    gui.add(uiObj, 'regionWireframe');
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
        queryRegion.position.z -= speed;
    } else if (keyCode == 69) {
        queryRegion.position.z += speed;
    }
};

function update() {

    controls.update();

    queryPoints = [];
    queryPoints = octree.query(queryRegion, queryPoints);

    queryRegionWireframe.position.x = queryRegion.position.x;
    queryRegionWireframe.position.y = queryRegion.position.y;
    queryRegionWireframe.position.z = queryRegion.position.z;

    octree = new Octree(region, regionCapacity);

    for (const boid of boids) {
        octree.insert(boid);
    }

    for (let i = 0; i < boids.length; i++) {
        let boid = boids[i];

        boid.alignmentMultiplier = uiObj.alignment;
        boid.separationMultiplier = uiObj.separation;
        boid.cohesionMultiplier = uiObj.cohesion;
        boid.maxSpeed = uiObj.maxSpeed;
        boid.maxForce = uiObj.maxForce;

        const boidBoundBox = new BoundingBox(
            boid.position.x - boidBoundBoxRange / 2,
            boid.position.y - boidBoundBoxRange / 2,
            boid.position.z - boidBoundBoxRange / 2,
            boidBoundBoxRange,
            boidBoundBoxRange,
            boidBoundBoxRange
        );
        
        nearbyBoids = octree.query(boidBoundBox);

        boid.wrapOnEdges(region);
        boid.flock(nearbyBoids);
        boid.update();
    }
}

function render() {
    removeObjects('boids');
    removeObjects('queryRegionBoids');
    removeObjects('octreeWireframe');

    renderBoids(scene, boids);

    if (uiObj.regionWireframe) {
        renderBoids(scene, queryPoints, 'yellow', 4, 'queryRegionBoids');
    }

    queryRegionWireframe.visible = uiObj.regionWireframe;

    if (uiObj.octreeWireframe) {
        octree.show(scene);
    }

    scene.traverse ((child) => {
        if (child instanceof THREE.Line) {
            if (child.name === 'octreeWireframe') {
                child.visible = uiObj.octreeWireframe;
            }
        }
    });

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

function removeObjects(name) {
    const objects = [];
    scene.traverse ((child) => {
        if (child.name === name) {
            objects.push(child);
        }
    });

    for (const object of objects) {
        scene.remove(object);
    }
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
