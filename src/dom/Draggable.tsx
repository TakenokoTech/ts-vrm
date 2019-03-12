export default class Draggable {
    private x: number = 0;
    private y: number = 0;

    constructor(private parent: HTMLElement, private element: HTMLElement) {
        this.up = this.up.bind(this);
        this.down = this.down.bind(this);
        this.move = this.move.bind(this);
        this.element.addEventListener("mousedown", this.down, false);
        this.element.addEventListener("touchstart", this.down, false);
    }

    down(event: Event | TouchEvent): any {
        // console.log("down");
        this.element.classList.add("drag");
        const e = event.type === "mousedown" ? event : event.changedTouches[0];
        this.x = e.pageX - this.parent.offsetLeft;
        this.y = e.pageY - this.parent.offsetTop;
        document.body.addEventListener("mousemove", this.move, false);
        document.body.addEventListener("touchmove", this.move, false);
        this.element.addEventListener("mouseup", this.up, false);
        this.element.addEventListener("touchend", this.up, false);
    }

    move(event: Event) {
        // console.log("move");
        const e = event.type === "mousemove" ? event : event.changedTouches[0];
        e.preventDefault();
        this.parent.style.top = e.pageY - this.y + "px";
        this.parent.style.left = e.pageX - this.x + "px";
        document.body.addEventListener("mouseleave", this.up, false);
        document.body.addEventListener("touchleave", this.up, false);
        this.element.addEventListener("mouseup", this.up, false);
        this.element.addEventListener("touchend", this.up, false);
    }

    up(event: Event) {
        // console.log("up");
        this.element.classList.remove("drag");
        document.body.removeEventListener("mousemove", this.move, false);
        document.body.removeEventListener("touchmove", this.move, false);
        this.element.removeEventListener("mouseup", this.up, false);
        this.element.removeEventListener("touchend", this.up, false);
    }
}
