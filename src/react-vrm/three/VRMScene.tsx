import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
import Stats from "stats-js";
import WebVRM from "../../react-vrm/vrm/WebVRM";
import { Vector3 } from "three";

interface BaseThreeScene {
    scene: THREE.Scene;
    camera: THREE.Camera;
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
    public camera: THREE.Camera;
    public avatar: WebVRM;
    public renderer: THREE.WebGLRenderer;
    public controls: OrbitControls;
    public stats: Stats;

    private width = 0;
    private height = 0;
    private avaterBones: { [key: string]: THREE.Bone } = {};
    private modelURL = `../../static/vrm/nokoko.vrm`;

    constructor(private canvas: HTMLElement) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.stats = this.createStats();
        this.camera = this.createCamera();
        this.controls = this.createControls();
        this.renderer = this.createRenderer();
        this.avatar = new WebVRM(this.modelURL, this.scene, this.onLoad.bind(this));
        canvas.appendChild(this.renderer.domElement);
        this.addScene();
        this.render();
    }

    addScene() {
        this.scene.add(this.createLight());
        this.scene.add(this.createDictLight());
        this.scene.add(this.createBall());
        this.scene.add(this.createFloar());
        // this.scene.add(this.createBackgroud());
    }

    createCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 2000);
        camera.position.set(100, 200, -200);
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
        renderer.setSize(this.width, this.height);
        renderer.setClearColor(0xaacccc, 1);
        // renderer.setPixelRatio(1);
        // renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createLight(): THREE.Light {
        // const light = new THREE.PointLight(0xffffff, 1.6);
        // light.position.set(0, 256, -100);
        // light.shadowMapWidth = 2048;
        // light.shadowMapHeight = 2048;
        // light.castShadow = true;
        // this.scene.add(new THREE.PointLightHelper(light, 0xff0000));
        var ambient = new THREE.AmbientLight(0x333333);
        this.scene.add(ambient);
        return ambient;
    }

    createDictLight(): THREE.Light | THREE.Object3D {
        const FIELD_SIZE = 256;
        const directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.6);
        directionalLight.position.set(0, 256, -100);
        directionalLight.shadow.camera.near = 0.5;
        // directionalLight.shadow.camera.far = FIELD_SIZE;
        directionalLight.shadow.camera.top = FIELD_SIZE;
        directionalLight.shadow.camera.bottom = FIELD_SIZE * -1;
        directionalLight.shadow.camera.left = FIELD_SIZE;
        directionalLight.shadow.camera.right = FIELD_SIZE * -1;
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 4096;
        directionalLight.shadow.mapSize.height = 4096;
        this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000));
        return directionalLight;
    }

    createFloar(): THREE.Object3D {
        const meshFloor = new THREE.Mesh(new THREE.BoxGeometry(1000, 100, 1000), new THREE.MeshLambertMaterial({ color: 0xcccccc }));
        meshFloor.position.y = -50;
        meshFloor.receiveShadow = true;
        return meshFloor;
    }

    createBall(): THREE.Object3D {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(64, 32, 32), new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: true }));
        ball.position.set(0, 90, 0);
        ball.castShadow = true;
        const ball2 = new THREE.Mesh(new THREE.SphereGeometry(64, 32, 32), new THREE.MeshLambertMaterial({ color: 0x88ccff }));
        ball2.position.set(0, 90, 0);
        ball2.castShadow = true;
        this.scene.add(ball2);
        return ball;
    }

    createBackgroud(): THREE.Object3D {
        const background = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.0, 2.0), new THREE.MeshPhongMaterial({ color: 0x88ccff }));
        background.renderOrder = -1;
        return background;
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
        this.avatar.scene.scale.x = 100;
        this.avatar.scene.scale.y = 100;
        this.avatar.scene.scale.z = 100;
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
    }
}
