export function nextPowerOf2(n: number): number {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}

export function createPointCloudSphere(count: number, maxRadius: number, minRadius = 0): number[] {
    const points = [];
    const minRadiusNormalized = minRadius / maxRadius;
    for (let i = 0; i < count; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const ratio = minRadiusNormalized + Math.pow(Math.random(), 1 / 3) * (1.0 - minRadiusNormalized);
        const distance = ratio * maxRadius;
        points.push(Math.sin(phi) * Math.cos(theta) * distance);
        points.push(Math.sin(phi) * Math.sin(theta) * distance);
        points.push(Math.cos(phi) * distance);
    }
    return points;
}
