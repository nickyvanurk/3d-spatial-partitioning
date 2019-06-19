const regionWidth = 100;
const regionHeight = 100;
const regionDepth = 100;
const regionCapacity = 4;

const region = new BoundingBox(0, 0, 0, regionWidth, regionHeight, regionDepth);
const octree = new Octree(region, regionCapacity);

for (let i = 0; i < 50; i++) {
    let point = new Point(
        parseInt(Math.random() * regionWidth),
        parseInt(Math.random() * regionHeight),
        parseInt(Math.random() * regionDepth)
    );

    octree.insert(point);
}

console.log(octree);
