export function nextPowerOf2(n: number) : number {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}