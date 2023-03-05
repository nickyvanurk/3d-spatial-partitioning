export class Time {
    static now = 0;
    static last = 0;
    static deltaTime = 0;
    static fixedDeltaTime = 0;
    static time = 0;
    static fixedTime = 0;
    static accumulator = 0;
    static alpha = 0;
}

export class Loop {
    private fixedCallback: () => void;
    private callback: () => void;

    constructor(fixedDeltaTime: number) {
        Time.fixedDeltaTime = fixedDeltaTime;
    }

    start(fixedCallback: () => void, callback: () => void) {
        Time.last = window.performance.now();
        this.fixedCallback = fixedCallback;
        this.callback = callback;
        window.requestAnimationFrame(this.step.bind(this));
    }

    step() {
        Time.now = window.performance.now();
        Time.deltaTime = Math.min((Time.now - Time.last) / 1000, 0.25);
        Time.last = Time.now;

        Time.accumulator += Time.deltaTime;

        if (Time.accumulator >= Time.fixedDeltaTime) {
            this.fixedCallback();
            Time.fixedTime += Time.fixedDeltaTime;
            Time.accumulator -= Time.fixedDeltaTime;
        }

        Time.alpha = Time.accumulator / Time.fixedDeltaTime;

        this.callback();
        Time.time += Time.deltaTime;

        window.requestAnimationFrame(this.step.bind(this));
    }
}
