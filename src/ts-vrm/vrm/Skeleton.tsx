import { GLTF, Scene, AnimationClip, Object3D } from "three";
import { GlTFProperty } from "../../schema/glTF/glTF.schema";
import { Vrm, VrmHumanoidBone } from "../../schema/UniVRM/vrm.schema";

interface BoneReef {
    name: string;
    bone: THREE.Object3D;
}

//  ポーズ制御
export default class Skeleton {
    private boneMap: Map<string, BoneReef> = new Map();

    constructor(scene: Scene, json: GlTFProperty) {
        this.boneMap = this.createBoneMap(scene, json);
    }

    private createBoneMap(scene: Scene, json: GlTFProperty) {
        let newBoneMap = new Map();
        if (json.extensions) {
            const vrm: Vrm = json.extensions.VRM as Vrm;
            if (!vrm || !vrm.humanoid) return newBoneMap;
            for (const target of vrm.humanoid.humanBones || []) {
                if (!target.node) continue;
                const name = json.nodes[target.node].name;
                newBoneMap.set(target.bone, {
                    name: name,
                    bone: scene.getObjectByName(name)
                });
            }
        }
        return newBoneMap;
    }

    // ボーンの角度を設定　setRotation("head",{x:0,y:0,z:1})
    // key   必須
    // x,y,z 指定したもののみ反映
    setRotation(key: string, angle: THREE.Euler) {
        const born: BoneReef | undefined = this.boneMap.get(key);
        if (born != undefined) {
            if (angle.x != undefined) born.bone.rotation.x = angle.x;
            if (angle.y != undefined) born.bone.rotation.y = angle.y;
            if (angle.z != undefined) born.bone.rotation.z = angle.z;
        }
    }

    getBoneName(key: string): string {
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
