export class Window {
    public width: number;
    public height: number;
    public canvas: HTMLElement;
    public devicePixelRatio: number;

    private readonly parent: HTMLElement;
    private resizeCallback: (window: this) => void;

    constructor(selector = 'body') {
        this.canvas = document.createElement('canvas');
        this.parent = document.querySelector(selector);
        this.parent.appendChild(this.canvas);

        this.width = this.parent.clientWidth;
        this.height = this.parent.clientHeight;
        this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    public setResizeCallback(cb: () => void) {
        this.resizeCallback = cb;
    }

    private onWindowResize() {
        this.width = this.parent.clientWidth;
        this.height = this.parent.clientHeight;

        if (this.resizeCallback) {
            this.resizeCallback(this);
        }
    }
}
