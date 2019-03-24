import _ from "lodash";
import * as THREE from "three";
import { InspectorManager } from "./InspectorSceneInterface";
import { Object3D, CircleBufferGeometry, Color } from "three";
import CANNON from "cannon";
import { MultipleInputsCol, MultipleSelectCol } from "./InspectorSceneInterface";
import { GeometryType, createGeometry, geometryParam, BoxGeometryParam, CircleGeometryParam, SphereGeometryParam } from "./InspectorSceneInterface";
import { paramList } from "./InspectorSceneInterface";
import { MaterialType, materialParam, createMaterial, castMaterial } from "./InspectorSceneInterface";

export class InspectorScene {
    private manager: InspectorManager;
    private target: { [key: string]: THREE.Mesh } = {};

    constructor(manager: InspectorManager) {
        this.manager = manager;
        this.onLoad = this.onLoad.bind(this);
    }

    onLoad(manager: InspectorManager) {
        this.manager = manager;
        // console.log(this.manager.vrmScene.scene);

        while (this.manager.inspectorDom.firstChild) {
            this.manager.inspectorDom.removeChild(this.manager.inspectorDom.firstChild);
        }

        const div = document.createElement("div");
        if (this.manager.vrmScene.scene.children.length > 0) {
            const obj: Object3D = this.manager.vrmScene.scene.children[this.manager.selectNumber];
            console.log(obj);

            const d = document.createElement("div");
            d.className = "inspecter_obj_name";
            d.innerText = obj.name;
            div.appendChild(d);

            this.addPosition(div, obj);
            this.addRotation(div, obj);
            this.addScale(div, obj);
            this.addLayer(div, obj);

            const light = obj as THREE.Light;
            if (light.color && light.color.r) {
                this.addColor(div, light);
                this.addIntensity(div, light);
            }

            const mesh = obj as THREE.Mesh;
            if (mesh && mesh.geometry) {
                this.addGeometry(div, mesh);
            }
            if (mesh && mesh.material) {
                this.addMaterial(div, mesh);
            }
        }
        this.manager.inspectorDom.appendChild(div);
    }

    create(i: string) {
        for (const obj of this.manager.vrmScene.scene.children) if (obj.name == "col_" + i) return;
        const material = { color: 0xdddddd, wireframe: true };
        const ball = new THREE.Mesh(new THREE.SphereGeometry(8, 16, 16), new THREE.MeshLambertMaterial(material));
        ball.name = "col_" + i;
        ball.position.set(0, 0, 0);
        ball.castShadow = true;
        this.target[i] = ball;
        this.manager.vrmScene.scene.add(ball);
    }

    updateFrame() {
        const obj: Object3D = this.manager.vrmScene.scene.children[this.manager.selectNumber];
        for (const b of this.manager.cannonScene.world.bodies) {
            for (const i in b.shapes) {
                this.create(b.id);
                this.target[b.id].position.set(b.position.x, b.position.y, b.position.z);
                this.target[b.id].quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w);
                switch (true) {
                    case b.shapes[i] instanceof CANNON.Box: {
                        const par: any = { width: b.shapes[i].halfExtents.x * 2 + 4, height: b.shapes[i].halfExtents.y * 2 + 4, depth: b.shapes[i].halfExtents.z * 2 + 4 };
                        const tempParam = (this.target[b.id].geometry as THREE.BoxGeometry).parameters;
                        if (par.width != tempParam.width || par.height != tempParam.height || par.depth != tempParam.depth) {
                            this.target[b.id].geometry = createGeometry(GeometryType.BoxGeometry, par);
                        }
                        break;
                    }
                    case b.shapes[i] instanceof CANNON.Sphere: {
                        const par: any = { radius: b.shapes[i].radius + 1, widthSegments: 16, heightSegments: 16 };
                        const tempParam = (this.target[b.id].geometry as THREE.SphereGeometry).parameters;
                        if (par.radius != tempParam.radius || par.widthSegments != tempParam.widthSegments || par.heightSegments != tempParam.heightSegments) {
                            this.target[b.id].geometry = createGeometry(GeometryType.SphereGeometry, par);
                        }
                        break;
                    }
                }
            }
        }
    }

    createMultipleInputs(title: string = "", colList: MultipleInputsCol[], selectList: MultipleSelectCol[] = []): Element {
        const input = document.createElement("div");
        input.className = "input-group";

        const prepend = document.createElement("div");
        prepend.className = "input-group-prepend";

        if (title != "") {
            const span = document.createElement("span");
            span.className = "input-group-text";
            span.innerHTML = title;
            prepend.appendChild(span);
        }

        input.appendChild(prepend);

        if (selectList.length > 0) {
            const select = document.createElement("select");
            select.className = "custom-select";
            select.id = "inputGroupSelect01";
            select.onchange = () => selectList[0].callback(select.value);
            for (const sel of selectList || []) {
                const option = document.createElement("option");
                option.value = sel.value;
                option.innerText = sel.value;
                option.selected = sel.selected;
                select.appendChild(option);
            }
            input.appendChild(select);
        }

        for (const col of colList) {
            const form = document.createElement("input");
            form.type = col.type || "number";
            form.className = "form-control";
            form.value = String(col.value);
            form.step = String(col.step || "0.1");
            form.onchange = () => col.callback(form.value);
            // form.onkeydown = e => console.log(form.value);
            input.appendChild(form);
        }
        return input;
    }

    createIcon() {
        const icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "fullscreen";
        return icon;
    }

    addPosition(div: HTMLDivElement, obj: THREE.Object3D) {
        div.appendChild(
            this.createMultipleInputs("Position", [
                {
                    value: obj.position.x,
                    callback: (v: number) => (obj.position.x = v)
                },
                {
                    value: obj.position.y,
                    callback: (v: number) => (obj.position.y = v)
                },
                {
                    value: obj.position.z,
                    callback: (v: number) => (obj.position.z = v)
                }
            ])
        );
    }

    addRotation(div: HTMLDivElement, obj: THREE.Object3D) {
        div.appendChild(
            this.createMultipleInputs("Rotation", [
                {
                    value: obj.rotation.x,
                    callback: (v: number) => (obj.rotation.x = v)
                },
                {
                    value: obj.rotation.y,
                    callback: (v: number) => (obj.rotation.y = v)
                },
                {
                    value: obj.rotation.z,
                    callback: (v: number) => (obj.rotation.z = v)
                }
            ])
        );
    }

    addScale(div: HTMLDivElement, obj: THREE.Object3D) {
        div.appendChild(
            this.createMultipleInputs("Scale", [
                {
                    value: obj.scale.x,
                    callback: (v: number) => (obj.scale.x = v)
                },
                {
                    value: obj.scale.y,
                    callback: (v: number) => (obj.scale.y = v)
                },
                {
                    value: obj.scale.z,
                    callback: (v: number) => (obj.scale.z = v)
                }
            ])
        );
    }

    addLayer(div: HTMLDivElement, obj: THREE.Object3D) {
        div.appendChild(
            this.createMultipleInputs("Layers", [
                {
                    value: obj.layers.mask,
                    step: "1",
                    callback: (v: number) => {
                        obj.layers.mask = 0;
                        // obj.layers.disable(Number(obj.layers.mask));
                        obj.layers.enable(Number(v));
                    }
                }
            ])
        );
    }

    addColor(div: HTMLDivElement, obj: THREE.Light) {
        div.appendChild(
            this.createMultipleInputs("Color", [
                {
                    value: obj.color.r,
                    callback: (v: number) => (obj.color.r = v)
                },
                {
                    value: obj.color.g,
                    callback: (v: number) => (obj.color.g = v)
                },
                {
                    value: obj.color.b,
                    callback: (v: number) => (obj.color.b = v)
                }
            ])
        );
    }

    addIntensity(div: HTMLDivElement, obj: THREE.Light) {
        div.appendChild(
            this.createMultipleInputs("Intensity", [
                {
                    value: obj.intensity,
                    callback: (v: number) => (obj.intensity = v)
                }
            ])
        );
    }

    addGeometry(div: HTMLDivElement, obj: THREE.Mesh) {
        const selectList: MultipleSelectCol[] = [];
        const parameters = obj.geometry.parameters;

        Object.entries(GeometryType).forEach(([key, value]) => {
            selectList.push({
                value: value,
                selected: value == obj.geometry.type,
                callback: (type: string) => {
                    obj.geometry = createGeometry(type, geometryParam(type));
                    this.manager.render();
                }
            });
        });
        div.appendChild(this.createMultipleInputs("Geometry", [], selectList));

        for (const p in parameters) {
            if (paramList(geometryParam(obj.geometry.type)).indexOf(p) == -1) {
                continue;
            }
            div.appendChild(
                this.createMultipleInputs("Geo." + p, [
                    {
                        value: parameters[p],
                        callback: (v: number) => {
                            parameters[p] = Number(v);
                            obj.geometry = createGeometry(obj.geometry.type, parameters);
                        }
                    }
                ])
            );
        }
    }

    addMaterial(div: HTMLDivElement, obj: THREE.Mesh) {
        const selectList: MultipleSelectCol[] = [];

        if (obj.material instanceof Array) {
            return;
        }

        Object.entries(MaterialType).forEach(([key, value]) => {
            selectList.push({
                value: value,
                selected: value == castMaterial(obj.material).type,
                callback: (type: string) => {
                    const param = materialParam(type);
                    param.color = castMaterial(obj.material).color;
                    param.wireframe = castMaterial(obj.material).wireframe;
                    obj.material = createMaterial(type, param);
                    this.manager.render();
                }
            });
        });
        div.appendChild(this.createMultipleInputs("Material", [], selectList));

        div.appendChild(
            this.createMultipleInputs("Mat.color", [
                {
                    value: castMaterial(obj.material).color.getHexString(),
                    type: "text",
                    callback: (v: string) => {
                        castMaterial(obj.material).color = new Color().set("#" + v);
                        this.manager.render();
                    }
                }
            ])
        );

        div.appendChild(
            this.createMultipleInputs(
                "Mat.wireframe",
                [],
                [
                    {
                        value: "false",
                        selected: !castMaterial(obj.material).wireframe,
                        callback: (v: string) => {
                            castMaterial(obj.material).wireframe = v == "true";
                            this.manager.render();
                        }
                    },
                    {
                        value: "true",
                        selected: castMaterial(obj.material).wireframe,
                        callback: (v: string) => {}
                    }
                ]
            )
        );
    }
}
