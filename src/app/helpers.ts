import * as THREE from 'three';

export function nextPowerOf2(n: number): number {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}

export function createPointCloudSphere(
    count: number,
    maxRadius: number,
    minRadius = 0,
    size = 1,
    color = 0xffffff,
    fog = true,
) {
    const points = generatePointCloudSpherePoints(count, maxRadius, minRadius, true) as number[];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points), 3));
    const material = new THREE.PointsMaterial({ color, size, fog });
    return new THREE.Points(geometry, material);
}

export function generatePointCloudSpherePoints(count: number, maxRadius: number, minRadius = 0, contiguous = false) {
    const points = [];
    const minRadiusNormalized = minRadius / maxRadius;
    for (let i = 0; i < count; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const ratio = minRadiusNormalized + Math.pow(Math.random(), 1 / 3) * (1.0 - minRadiusNormalized);
        const distance = ratio * maxRadius;

        const x = Math.sin(phi) * Math.cos(theta) * distance;
        const y = Math.sin(phi) * Math.sin(theta) * distance;
        const z = Math.cos(phi) * distance;

        if (contiguous) {
            points.push(x, y, z);
        } else {
            points.push(new THREE.Vector3(x, y, z));
        }
    }

    return points;
}
