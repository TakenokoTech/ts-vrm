import VRMScene from "./VRMScene";
import { DomManager } from "..";

export interface InspectorManager extends DomManager {}

export interface MultipleInputsCol {
    value: number;
    onChanges: (value: number) => any;
}
