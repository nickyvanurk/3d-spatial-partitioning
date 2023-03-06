import { Time } from './time';

export class Loop {
    private fixedCallback: () => void;
    private callback: () => void;

    constructor(fixedDeltaTime: number, fixedCallback: () => void, callback: () => void) {
        Time.fixedDeltaTime = fixedDeltaTime;
        Time.last = window.performance.now();
        this.fixedCallback = fixedCallback;
        this.callback = callback;
        window.requestAnimationFrame(this.run.bind(this));
    }

    run() {
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

        window.requestAnimationFrame(this.run.bind(this));
    }
}
