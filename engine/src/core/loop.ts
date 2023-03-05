type fixedCallback = (time: number, fixedDelta: number) => void;
type callback = (time: number, delta: number, alpha: number, fixedDelta: number) => void;

export class Loop {
    running = false;
    startTime = 0;

    private currentTime = 0;
    private accumulator = 0;
    private time = 0;
    private fixedCallback: fixedCallback;
    private callback: callback;

    constructor(private dt: number) {}

    start(updateCallback: fixedCallback, renderCallback: callback) {
        this.running = true;
        this.startTime = window.performance.now();
        this.fixedCallback = updateCallback;
        this.callback = renderCallback;
        window.requestAnimationFrame(this.step.bind(this));
    }

    step() {
        const newTime = window.performance.now();
        const frameTime = Math.min((newTime - this.currentTime) / 1000, 0.25);
        this.currentTime = newTime;
        this.accumulator += frameTime;

        if (this.accumulator >= this.dt) {
            this.fixedCallback(this.time, this.dt);
            this.time += this.dt;
            this.accumulator -= this.dt;
        }

        const alpha = this.accumulator / this.dt;
        this.callback(this.time, frameTime, alpha, this.dt);
        window.requestAnimationFrame(this.step.bind(this));
    }
}
