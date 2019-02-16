import * as THREE from "three";
import { Object3D, Scene, Material } from "three";
import BlendShape from "./BlendShape";
import Skeleton from "./Skeleton";
import { Vrm } from "../../schema/UniVRM/vrm.schema";
import VRMLoader from "./VRMLoader";

/**
 *
 * https://github.com/Keshigom/WebVRM/blob/master/docs/src/WebVRM.js
 */
export default class WebVRM {
    private vrm: Vrm;
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
        new VRMLoader().load(avatarFileURL, vrm => {
            vrm.scene.name = "VRM";
            vrm.scene.traverse(this.attachMaterial);
            this.vrm = vrm;
            this.skeleton = new Skeleton(vrm.scene, vrm.parser.json);
            this.blendShape = new BlendShape(vrm.scene, vrm.parser.json);
            this.isReady = true;
            targetScene.add(vrm.scene);
            callBackReady();
        });
    }

    private attachMaterial(object3D: Object3D) {
        let object = object3D as CustomObject3D;
        if (!object.material) {
            return;
        }
        if (Array.isArray(object.material)) {
            for (var i = 0, il = object.material.length; i < il; i++) {
                var material = new THREE.MeshBasicMaterial();
                THREE.Material.prototype.copy.call(material, object.material[i]);
                material.color.copy(new THREE.Color(object.material[i].color[0], object.material[i].color[1], object.material[i].color[2]));
                material.map = object.material[i].map;
                material.lights = false;
                material.skinning = object.material[i].skinning;
                material.morphTargets = object.material[i].morphTargets;
                material.morphNormals = object.material[i].morphNormals;
                console.log(object.material[i]);
                object.material[i] = material;
            }
        } else {
            var material = new THREE.MeshBasicMaterial();
            THREE.Material.prototype.copy.call(material, object.material);
            material.color.copy(object.material.color);
            material.map = object.material.map;
            material.lights = false;
            material.skinning = object.material.skinning;
            material.morphTargets = object.material.morphTargets;
            material.morphNormals = object.material.morphNormals;
            object.material = material;
        }
    }
}

interface CustomObject3D extends Object3D {
    material: any;
}
