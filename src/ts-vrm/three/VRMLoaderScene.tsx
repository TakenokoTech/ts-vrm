import _ from "lodash";
import * as THREE from "three";
import { Object3D } from "three";
import { VRMLoaderManager } from "./VRMLoaderSceneInterface";

export class VRMLoaderScene {
    private manager: VRMLoaderManager;

    constructor(manager: VRMLoaderManager) {
        this.manager = manager;
        this.onLoad = this.onLoad.bind(this);
    }

    onLoad(manager: VRMLoaderManager) {
        this.manager = manager;
        // console.log(this.manager.vrmScene.scene);
        while (this.manager.vrmloaderDom.firstChild) {
            this.manager.vrmloaderDom.removeChild(this.manager.vrmloaderDom.firstChild);
        }
        this.manager.vrmloaderDom.appendChild(this.createUrlForm("http://127.0.0.1:8887/static/vrm/nokoko.vrm", "nokoko"));
        this.manager.vrmloaderDom.appendChild(this.createUrlForm("http://127.0.0.1:8887/static/vrm/panda.vrm", "panda"));
        this.manager.vrmloaderDom.appendChild(this.createUrlForm("http://127.0.0.1:8887/static/vrm/AliciaSolid.vrm", "alicia"));
    }

    createUrlForm(defaultURL = "", name = "") {
        const input = document.createElement("div");
        input.className = "input-group";

        // const prepend = document.createElement("div");
        // prepend.className = "input-group-prepend";
        // input.appendChild(prepend);

        // const span = document.createElement("span");
        // span.className = "input-group-text";
        // span.innerHT""ML = "VRM URL";
        // prepend.appendChild(span);

        const form = document.createElement("input");
        form.type = "text";
        form.className = "form-control";
        form.value = defaultURL;
        input.appendChild(form);

        const append = document.createElement("div");
        append.className = "input-group-append";
        input.appendChild(append);

        const button = document.createElement("button");
        button.type = "button";
        button.id = "";
        button.innerHTML = "load";
        button.className = "btn btn-light";
        button.onclick = () => {
            this.manager.modelName = name;
            this.manager.vrmScene.loadVRM(form.value);
        };
        append.appendChild(button);

        return input;
    }
}
