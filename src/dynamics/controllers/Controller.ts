import ControllerEdge from "./ControllerEdge";
import World from "../World";
import {TimeStep} from "../Solver";
import Body from "../Body";

const _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;


const DEBUG_SOLVER = false;


export default class Controller {
    /** @internal */
    m_next: Controller;
    /** @internal */
    m_prev: Controller;
    /** @internal */
    m_bodyList: ControllerEdge;
    /** @internal */
    m_bodyCount: number = 0;
    /** @internal */
    m_world: World;

    // TODO: Add createController to world
    constructor(world: World) {
        this.m_world = world;
    }

    step(step: TimeStep): void {

    }

    draw(step: TimeStep): void {

    }

    addBody(body: Body): void {
        const edge = new ControllerEdge();

        edge.controller = this;
        edge.body = body;
        edge.nextBody = this.m_bodyList;
        edge.prevBody = null;

        this.m_bodyList = edge;

        if (edge.nextBody) {
            edge.nextBody.prevBody = edge;
        }

        this.m_bodyCount++;

        edge.nextController = body.m_controllerList;
        edge.prevController = null;
        body.m_controllerList = edge;

        if (edge.nextController) {
            edge.nextController.prevController = edge;
        }

        body.m_controllerCount++;
    }

    removeBody(body: Body): void {
        let edge: ControllerEdge = body.m_controllerList;

        while (edge && edge.controller != this) {
            edge = edge.nextController;
        }

        if (edge.prevBody)
            edge.prevBody.nextBody = edge.nextBody;
        if (edge.nextBody)
            edge.nextBody.prevBody = edge.prevBody;
        if (edge.nextController)
            edge.nextController.prevController = edge.prevController;
        if (edge.prevController)
            edge.prevController.nextController = edge.nextController;
        if (this.m_bodyList == edge)
            this.m_bodyList = edge.nextBody;
        if (body.m_controllerList == edge)
            body.m_controllerList = edge.nextController;

        body.m_controllerCount--;
        this.m_bodyCount--;
    }

    clear(): void {
        while (this.m_bodyList) {
            this.removeBody(this.m_bodyList.body);
        }
    }

    getNext(): Controller {
        return this.m_next;
    }

    getWorld(): World {
        return this.m_world;
    }

    getBodyList(): ControllerEdge {
        return this.m_bodyList;
    }
}