import _ from "lodash";
import VRMScene from "./three/VRMScene";
import { HierarchyScene } from "./three/HierarchyScene";

export interface DomManager {
    stageDom: HTMLElement;
    hierarchyDom: HTMLElement;
    statDom: HTMLElement;
    vrmScene: VRMScene;
    hierarchyScene: HierarchyScene;
    render: () => void;
}

class main {
    private domManager: DomManager;

    constructor() {
        this.render = this.render.bind(this);
        const stage: HTMLElement = document.getElementById("stage") || new HTMLElement();
        const hierarchy: HTMLElement = document.getElementById("hierarchy") || new HTMLElement();
        const stat: HTMLElement = document.getElementById("stat") || new HTMLElement();
        this.domManager = { stageDom: stage, hierarchyDom: hierarchy, statDom: stat, vrmScene: null, hierarchyScene: null, render: this.render };
        this.domManager.vrmScene = new VRMScene(this.domManager);
        this.domManager.hierarchyScene = new HierarchyScene(this.domManager);
        this.render();
    }

    render() {
        // vrmScene.render();
        this.domManager.hierarchyScene.render(this.domManager);
    }
}

new main();
