import * as THREE from "three";
import { GLTF, Scene, AnimationClip, Object3D } from "three";
import GLTFLoader from "three-gltf-loader";
import { VRM, VRMLoader, VRMHumanBoneName } from "three-vrm";
import { GlTFProperty } from "../../schema/glTF/glTF.schema";

interface BoneReef {
    name: string;
    bone: THREE.Object3D;
}

//  ポーズ制御
export default class Skeleton {
    private boneMap: Map<VRMHumanBoneName, BoneReef> = new Map();

    constructor(scene: Scene, json: GlTFProperty) {
        this.boneMap = this.createBoneMap(scene, json);
    }

    private createBoneMap(scene: Scene, json: GlTFProperty) {
        let newBoneMap = new Map();
        if (json.extensions) {
            const vrm: VRM = json.extensions.VRM as VRM;
            for (const target of vrm.humanoid.humanBones) {
                newBoneMap.set(target.bone, {
                    name: json.nodes[target.node].name,
                    bone: scene.getObjectByName(json.nodes[target.node].name)
                });
            }
        }
        return newBoneMap;
    }

    // ボーンの角度を設定　setRotation("head",{x:0,y:0,z:1})
    // key   必須
    // x,y,z 指定したもののみ反映
    setRotation(key: VRMHumanBoneName, angle: THREE.Euler) {
        const born: BoneReef | undefined = this.boneMap.get(key);
        if (born != undefined) {
            if (angle.x != undefined) born.bone.rotation.x = angle.x;
            if (angle.y != undefined) born.bone.rotation.y = angle.y;
            if (angle.z != undefined) born.bone.rotation.z = angle.z;
        }
    }

    getBoneName(key: VRMHumanBoneName): string {
        const born: BoneReef | undefined = this.boneMap.get(key);
        if (born != undefined) {
            return born.bone.name;
        } else {
            return "";
        }
    }

    //MapIteratorを返す
    getKeysIterator(): IterableIterator<string> {
        return this.boneMap.keys();
    }
}
