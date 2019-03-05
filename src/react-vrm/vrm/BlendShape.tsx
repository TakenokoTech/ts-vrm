import { Scene, Object3D, SkinnedMesh, Mesh } from "three";
import { VrmBlendshape, VrmBlendshapeBind, VrmBlendshapeGroup, Vrm } from "../../schema/UniVRM/vrm.schema";
import { GlTFProperty } from "../../schema/glTF/glTF.schema";

interface BoneReef {
    name: string;
    targets: VrmBlendshape[];
}

// 表情制御
// TODO:マテリアルの切り替えに対応する

export default class BlendShape {
    private blendShapeMap: Map<string, BoneReef> = new Map();

    constructor(scene: Scene, json: {}) {
        this.blendShapeMap = this.createShapeMap(scene, json);
    }

    //FIXME:複数の表情を同時に設定するとモデルが破綻する
    //a-oのリップシンクとblink_l,r の瞬きは干渉しないものとしている。
    setExpression(key: string, value: number) {
        const born: BoneReef | undefined = this.blendShapeMap.get(key);
        if (born != undefined) {
            born.targets.forEach(target => {
                if (target.index != undefined && target.morphTargetInfluences != undefined) {
                    target.morphTargetInfluences[target.index] = value * target.weight * 0.01;
                }
            });
        }
    }

    //MapIteratorを返す
    getKeysIterator(): IterableIterator<string> {
        return this.blendShapeMap.keys();
    }

    private createShapeMap(scene: Scene, json: GlTFProperty) {
        let shapeMap = new Map();
        if (json.extensions) {
            const vrm: Vrm = json.extensions.VRM as Vrm;
            const blendShapeGroups = vrm.blendShapeMaster.blendShapeGroups;
            for (const blendShapeObj of blendShapeGroups) {
                if (blendShapeObj.presetName != "unknown") {
                    shapeMap.set(blendShapeObj.presetName, {
                        name: blendShapeObj.name,
                        targets: this.getTargets(blendShapeObj.binds, json.meshes, scene)
                    });
                } else {
                }
            }
        }
        return shapeMap;
    }

    private getTargets(binds: VrmBlendshapeBind[] = [], meshes: Mesh[], scene: Scene) {
        let targets: VrmBlendshape[] = [];
        binds.forEach((bind: VrmBlendshapeBind, index: number) => {
            let target: { [s: string]: any } = {};
            if (bind.mesh != undefined) {
                const meshName = meshes[bind.mesh].name;
                target["meshName"] = meshName;
                target["weight"] = bind.weight;
                target["index"] = bind.index;
                target["morphTargetInfluences"] = this.getMorphTarget(meshName.replace(".baked", ""), scene);
                targets[index] = target;
            }
        });
        return targets;
    }

    private getMorphTarget(name: string, scene: Scene) {
        const targetObj: Mesh | undefined = scene.getObjectByName(name) as Mesh;
        if (targetObj != undefined) {
            if (targetObj.morphTargetInfluences != undefined) {
                return targetObj.morphTargetInfluences;
            } else if (targetObj.children != undefined) {
                let morphTarget;
                targetObj.children.forEach(child => {
                    const mesh: Mesh | undefined = child as Mesh;
                    if (mesh.morphTargetInfluences != undefined) {
                        morphTarget = mesh.morphTargetInfluences;
                    }
                });
                return morphTarget;
            }
        }
    }
}
