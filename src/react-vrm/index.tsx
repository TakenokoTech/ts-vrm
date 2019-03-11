import _ from "lodash";
import VRMScene from "./three/VRMScene";
import { HierarchyScene } from "./three/HierarchyScene";
import Draggable from "../dom/Draggable";

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
        const hierarchy: HTMLElement = document.getElementById("hierarchy_contents") || new HTMLElement();
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

var hierarchy_p = document.getElementById("hierarchy");
var hierarchy_h = document.getElementById("hierarchy_header");
hierarchy_p && hierarchy_h && new Draggable(hierarchy_p, hierarchy_h);

var inspector_p = document.getElementById("inspector");
var inspector_h = document.getElementById("inspector_header");
inspector_p && inspector_h && new Draggable(inspector_p, inspector_h);
