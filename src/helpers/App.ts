import { Application } from "pixi.js";
import { BACKGROUND_COLOR } from "../constants/constants";

export class App extends Application {
    constructor() {
        super()
    } 

    async init(): Promise<void> {
        const options = {
            resizeTo: window,
            backgroundColor: BACKGROUND_COLOR,
            resolution: 1,
        }
        super.init(options);
    }
}




