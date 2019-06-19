const fpsLimit = 30;

const regionWidth = 300;
const regionHeight = 300;
const regionDepth = 300;
const regionCapacity = 4;

const points = 50;

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

    // generate points
    const pointsGeometry = new THREE.Geometry();

    for (let i = 0; i < points; i++) {
        let point = new Point(
            parseInt(Math.random() * regionWidth + region.position.x),
            parseInt(Math.random() * regionHeight  + region.position.y),
            parseInt(Math.random() * regionDepth  + region.position.z)
        );

        pointsGeometry.vertices.push(new THREE.Vector3(
            point.position.x,
            point.position.y,
            point.position.z
        ));

        octree.insert(point);
    }

    const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    particleMaterial.size = 2;

    scene.add(new THREE.Points(pointsGeometry, particleMaterial));

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

function animate() {
    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / fpsLimit);

    console.log('l');
    
    update();
    render();
}

init();
animate();
