import Controller from "./Controller";
import Body from "../Body";

const _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;


const DEBUG_SOLVER = false;


export default class ControllerEdge {
    controller: Controller;
    body: Body;
    prevBody: ControllerEdge | null = null;
    nextBody: ControllerEdge | null = null;
    prevController: ControllerEdge;
    nextController: ControllerEdge;
}