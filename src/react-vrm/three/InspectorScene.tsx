import _ from "lodash";
import * as THREE from "three";
import { InspectorManager } from "./InspectorSceneInterface";
import { Object3D } from "three";
import { MultipleInputsCol } from "./InspectorSceneInterface";

export class InspectorScene {
    private manager: InspectorManager;

    constructor(manager: InspectorManager) {
        this.manager = manager;
        this.render = this.render.bind(this);
    }

    render(manager: InspectorManager) {
        this.manager = manager;
        console.log(this.manager.vrmScene.scene);

        while (this.manager.inspectorDom.firstChild) {
            this.manager.inspectorDom.removeChild(this.manager.inspectorDom.firstChild);
        }

        const div = document.createElement("div");
        if (this.manager.vrmScene.scene.children.length > 0) {
            const obj: Object3D = this.manager.vrmScene.scene.children[this.manager.selectNumber];

            const d = document.createElement("div");
            d.className = "inspecter_obj_name";
            d.innerText = obj.name;
            div.appendChild(d);

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
            // geometry
            // material
            // color
        }
        this.manager.inspectorDom.appendChild(div);
    }

    createMultipleInputs(title: string = "", colList: MultipleInputsCol[]): Element {
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

        for (const col of colList) {
            const form = document.createElement("input");
            form.type = "number";
            form.className = "form-control";
            form.value = String(col.value);
            form.step = "0.1";
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
}
