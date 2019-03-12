import _ from "lodash";
import VRMScene from "./three/VRMScene";
import { HierarchyScene } from "./three/HierarchyScene";
import Draggable from "../dom/Draggable";
import { InspectorScene } from "./three/InspectorScene";

export interface DomManager {
    stageDom: HTMLElement;
    hierarchyDom: HTMLElement;
    inspectorDom: HTMLElement;
    statDom: HTMLElement;
    vrmScene: VRMScene;
    hierarchyScene: HierarchyScene;
    inspectorScene: InspectorScene;
    selectNumber: number;
    render: () => void;
}

class main {
    private domManager: DomManager;

    constructor() {
        this.render = this.render.bind(this);

        const stage: HTMLElement = document.getElementById("stage") || new HTMLElement();
        const hierarchy: HTMLElement = document.getElementById("hierarchy_contents") || new HTMLElement();
        const inspector: HTMLElement = document.getElementById("inspector_contents") || new HTMLElement();
        const stat: HTMLElement = document.getElementById("stat") || new HTMLElement();

        this.domManager = { stageDom: stage, hierarchyDom: hierarchy, inspectorDom: inspector, statDom: stat, vrmScene: null, hierarchyScene: null, inspectorScene: null, render: this.render, selectNumber: 0 };
        this.domManager.vrmScene = new VRMScene(this.domManager);
        this.domManager.hierarchyScene = new HierarchyScene(this.domManager);
        this.domManager.inspectorScene = new InspectorScene(this.domManager);

        this.render();
        this.draggable();
    }

    private draggable() {
        var hierarchy_p = document.getElementById("hierarchy");
        var hierarchy_h = document.getElementById("hierarchy_header");
        hierarchy_p && hierarchy_h && new Draggable(hierarchy_p, hierarchy_h);

        var inspector_p = document.getElementById("inspector");
        var inspector_h = document.getElementById("inspector_header");
        inspector_p && inspector_h && new Draggable(inspector_p, inspector_h);
    }

    render() {
        // vrmScene.render();
        this.domManager.hierarchyScene.render(this.domManager);
        this.domManager.inspectorScene.render(this.domManager);
    }
}

new main();
