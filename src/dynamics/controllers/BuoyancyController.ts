import Controller from "./Controller";
import Body from "../Body";
import Vec2 from "../../common/Vec2";
import World from "../World";
import {TimeStep} from "../Solver";
import ControllerEdge from "./ControllerEdge";
import Fixture from "../Fixture";
import Math from "../../common/Math";

const _ASSERT = typeof ASSERT === 'undefined' ? false : ASSERT;


const DEBUG_SOLVER = false;


export default class BuoyancyController extends Controller {
    normal: Vec2 = new Vec2(0, -1);
    offset: number = 0;
    density: number = 0;
    velocity: Vec2 = new Vec2(0, 0);
    linearDrag: number = 2;
    angularDrag: number = 1;
    useDensity: boolean = false;
    useWorldGravity: boolean = true;
    gravity: Vec2 | null = null;

    constructor(world: World) {
        super(world);
    }

    step(step: TimeStep) {
        if (!this.m_bodyList) {
            return;
        }
        if (this.useWorldGravity) {
            this.gravity = this.getWorld().getGravity().clone();
        }

        for (let i: ControllerEdge = this.m_bodyList; i; i = i.nextBody) {
            const body: Body = i.body;

            if (body.isAwake() == false) {
                //Buoyancy force is just a function of position,
                //so unlike most forces, it is safe to ignore sleeping bodes
                continue;
            }

            const areac: Vec2 = new Vec2();
            const massc: Vec2 = new Vec2();
            let area: number = 0.0;
            let mass: number = 0.0;

            for (let fixture = body.getFixtureList(); fixture; fixture = fixture.getNext()) {
                const sc: Vec2 = new Vec2();
                // TODO: ChainShape submerged area
                const sarea: number = fixture.getShape().computeSubmergedArea(this.normal, this.offset, body.getTransform(), sc);

                console.log(sarea);

                area += sarea;
                areac.x += sarea * sc.x;
                areac.y += sarea * sc.y;

                let shapeDensity: number;

                if (this.useDensity) {
                    //TODO: Figure out what to do now density is gone
                    shapeDensity = 1;
                } else {
                    shapeDensity = 1;
                }

                mass += sarea * shapeDensity;
                massc.x += sarea * sc.x * shapeDensity;
                massc.y += sarea * sc.y * shapeDensity;
            }

            areac.x /= area;
            areac.y /= area;
            massc.x /= mass;
            massc.y /= mass;

            if (area < Number.MIN_VALUE) {
                continue;
            }

            //Buoyancy
            const buoyancyForce: Vec2 = this.gravity.neg().clone();
            buoyancyForce.mul(this.density * area);
            body.applyForce(buoyancyForce, massc);

            //Linear drag
            const dragForce: Vec2 = body.getLinearVelocityFromWorldPoint(areac).clone();
            dragForce.sub(this.velocity);
            dragForce.mul(-this.linearDrag * area);
            body.applyForce(dragForce, areac);

            //Angular drag
            //TODO: Something that makes more physical sense?
            body.applyTorque(-body.getInertia() / body.getMass() * area * body.getAngularVelocity() * this.angularDrag);
        }
    }
}