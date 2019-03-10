import _ from "lodash";
import * as THREE from "three";
import { HierarchyManager } from "./HierarchySceneInterface";

export class HierarchyScene {
    private manager: HierarchyManager;

    constructor(manager: HierarchyManager) {
        this.manager = manager;
        this.render = this.render.bind(this);
    }

    render(manager: HierarchyManager) {
        this.manager = manager;
        console.log(this.manager.vrmScene.scene);
        while (this.manager.hierarchyDom.firstChild) {
            this.manager.hierarchyDom.removeChild(this.manager.hierarchyDom.firstChild);
        }
        for (const obj of this.manager.vrmScene.scene.children) {
            const div = document.createElement("div");

            if (obj.visible) {
                const button = document.createElement("button");
                button.className = (obj.visible ? "btn btn-light" : "btn btn-outline-light") + " object3d";
                button.innerText = obj.name;
                button.addEventListener("click", () => {
                    console.log("click");
                    obj.visible = !obj.visible;
                    button.className = (obj.visible ? "btn btn-light" : "btn btn-outline-light") + " object3d";
                });
                div.appendChild(button);
            }

            if (obj.material) {
                const iconButton = document.createElement("button");
                iconButton.className = obj.material.wireframe ? "btn btn-light" : "btn btn-outline-light";
                iconButton.appendChild(this.createIcon());
                iconButton.addEventListener("click", () => {
                    console.log("click");
                    obj.material.wireframe = !obj.material.wireframe;
                    iconButton.className = obj.material.wireframe ? "btn btn-light" : "btn btn-outline-light";
                });
                div.appendChild(iconButton);
            }

            this.manager.hierarchyDom.appendChild(div);
        }
    }

    createIcon() {
        const icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = "fullscreen";
        return icon;
    }
}
