export class Window {
    public width: number;
    public height: number;
    public devicePixelRatio: number;
    public canvas: HTMLElement;

    private parent: HTMLElement;
    private resizeCallback: (window: this) => void;

    constructor(selector = 'body') {
        this.canvas = document.createElement('canvas');
        this.parent = document.querySelector(selector);

        this.width = this.parent.clientWidth;
        this.height = this.parent.clientHeight;
        this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);
    }

    public init() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.parent.appendChild(this.canvas);
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
