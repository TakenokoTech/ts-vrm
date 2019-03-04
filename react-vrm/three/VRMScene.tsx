import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";
import WebVRM from "../../react-vrm/vrm/WebVRM";

interface BaseThreeScene {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    avatar: WebVRM;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    stats: Stats;

    createCamera(): THREE.PerspectiveCamera;
    createControls(): OrbitControls;
    createRenderer(): THREE.WebGLRenderer;
    createLight(): THREE.Light;
    createStats(): Stats;
    onLoad(): void;
    render(): void;
}

export default class VRMScene implements BaseThreeScene {
    public scene = new THREE.Scene();
    public camera: THREE.PerspectiveCamera;
    public avatar: WebVRM;
    public renderer: THREE.WebGLRenderer;
    public controls: OrbitControls;
    public stats: Stats;

    private avaterBones: { [key: string]: THREE.Bone } = {};
    private modelURL = `../../static/vrm/nokoko.vrm`;

    constructor(private canvas: Element) {
        this.stats = this.createStats();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.renderer = this.createRenderer();
        this.avatar = new WebVRM(this.modelURL, this.scene, this.onLoad.bind(this));
        canvas.appendChild(this.renderer.domElement);
        this.render();
    }

    createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
        camera.position.set(0, 1.5, -1);
        return camera;
    }

    createControls(): OrbitControls {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(0, 0.75, 0);
        controls.update();
        return controls;
    }

    createRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createLight(): THREE.Light {
        const light3 = new THREE.DirectionalLight(0xffffff);
        light3.position.set(0, 0, 1000);
        light3.shadowMapWidth = 2048;
        light3.shadowMapHeight = 2048;
        light3.castShadow = true;
        return light3;
    }

    createStats(): Stats {
        const stats = new Stats();
        stats.dom.style.position = "relative";
        stats.dom.style.top = "4px";
        stats.dom.style.left = "4px";
        stats.dom.style.margin = "auto";
        const debugWindow = document.body as Element;
        debugWindow.appendChild(stats.dom);
        return stats;
    }

    onLoad() {
        this.avatar.scene.traverse((object: any) => {
            if (object.isBone) this.avaterBones[object.name] = object;
        });
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }
}
