import { RoadWhiteLine } from "./RoadWhiteLine";
import { Container } from "pixi.js";
import { APP_SIZE } from "../constants/constants";

export class RoadWhiteLinesManager extends Container {
    constructor () {
        super()

        const WORK_SIZE = APP_SIZE
        const COUNT = 5

        for (let i = 0; i < COUNT; ++i) {
            const roadWhiteLine = new RoadWhiteLine()
            roadWhiteLine.x = -WORK_SIZE * .5 + WORK_SIZE / COUNT * i + WORK_SIZE / COUNT * .5
            this.addChild(roadWhiteLine)
        }
    }
}