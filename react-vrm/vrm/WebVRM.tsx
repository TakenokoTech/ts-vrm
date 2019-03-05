import _ from "lodash";
import { Object3D, Scene, Material, MeshBasicMaterial } from "three";
import { Vrm } from "../../schema/UniVRM/vrm.schema";
import BlendShape from "./BlendShape";
import VRMLoader from "./VRMLoader";
import Skeleton from "./Skeleton";

/**
 *
 * https://github.com/Keshigom/WebVRM/blob/master/docs/src/WebVRM.js
 */
export default class WebVRM {
    private vrm: Vrm | undefined;
    private skeleton: Skeleton;
    private blendShape: BlendShape;
    private isReady = false;

    constructor(avatarFileURL: string, targetScene: Scene, callBackReady = () => {}) {
        this.loadVRM(avatarFileURL, targetScene, callBackReady);
    }

    get scene(): Scene {
        if (this.vrm === undefined) console.log("Loading is incomplete");
        return this.vrm && this.vrm.scene;
    }

    get boneKeys() {
        return this.skeleton.getKeysIterator();
    }
    get expressionKeys() {
        return this.blendShape.getKeysIterator();
    }

    public setBoneRotation(key: string, angle: number) {
        this.skeleton.setRotation(key, angle);
    }

    public setExpression(key: string, value: number) {
        this.blendShape.setExpression(key, value);
    }

    private loadVRM(avatarFileURL: string, targetScene: Scene, callBackReady: Function) {
        new VRMLoader().load(avatarFileURL, (vrm: Vrm) => {
            vrm.scene.name = "VRM";
            console.log(vrm.scene);
            // vrm.scene.children.splice(1, 2);
            vrm.scene.traverse(this.attachMaterial);
            this.vrm = vrm;
            this.skeleton = new Skeleton(vrm.scene, vrm.parser.json);
            this.blendShape = new BlendShape(vrm.scene, vrm.parser.json);
            this.isReady = true;
            vrm.scene.castShadow = true;
            targetScene.add(vrm.scene);
            callBackReady();
        });
    }

    private attachMaterial(object3D: Object3D) {
        const createMaterial = (material: any): THREE.MeshBasicMaterial => {
            let newMaterial = new MeshBasicMaterial();
            newMaterial.name = material.name;
            newMaterial.color.copy(material.color);
            newMaterial.map = material.map;
            newMaterial.alphaTest = material.alphaTest;
            newMaterial.morphTargets = material.morphTargets;
            newMaterial.morphNormals = material.morphNormals;
            newMaterial.skinning = material.skinning;
            newMaterial.transparent = material.transparent;
            newMaterial.lights = false;
            // newMaterial.program = material.program;
            return newMaterial;
        };
        let object = object3D as CustomObject3D;
        if (!object.material) {
            return;
        }
        if (Array.isArray(object.material)) {
            object.material.forEach((m, index) => (object.material[index] = createMaterial(m)));
        } else {
            object.material = createMaterial(object.material);
        }
    }
}

interface CustomObject3D extends Object3D {
    material: any;
}
