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
        // console.log(this.manager.vrmScene.scene);
        while (this.manager.hierarchyDom.firstChild) {
            this.manager.hierarchyDom.removeChild(this.manager.hierarchyDom.firstChild);
        }
        for (const index in this.manager.vrmScene.scene.children) {
            const obj = this.manager.vrmScene.scene.children[index];
            const div = document.createElement("div");

            if (obj != undefined) {
                const button = document.createElement("button");
                button.className = (obj.visible ? "btn btn-light" : "btn btn-outline-light") + " object3d";
                button.innerText = obj.name;
                button.addEventListener("click", () => {
                    console.log("click");
                    //obj.visible = !obj.visible;
                    //button.className = (obj.visible ? "btn btn-light" : "btn btn-outline-light") + " object3d";
                    this.manager.selectNumber = index;
                    this.manager.render();
                });
                div.appendChild(button);
            }

            if (obj.visible != undefined) {
                const iconButton = document.createElement("button");
                iconButton.className = obj.visible ? "btn btn-light" : "btn btn-outline-light";
                iconButton.appendChild(this.createIcon("visibility"));
                iconButton.addEventListener("click", () => {
                    console.log("click");
                    obj.visible = !obj.visible;
                    iconButton.className = obj.visible ? "btn btn-light" : "btn btn-outline-light";
                });
                div.appendChild(iconButton);
            }

            if (obj.material) {
                const iconButton = document.createElement("button");
                iconButton.className = obj.material.wireframe ? "btn btn-light" : "btn btn-outline-light";
                iconButton.appendChild(this.createIcon("fullscreen"));
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

    createIcon(str: string) {
        const icon = document.createElement("i");
        icon.className = "material-icons";
        icon.innerHTML = str;
        return icon;
    }
}
