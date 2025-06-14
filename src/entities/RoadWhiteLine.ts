import { Graphics } from "pixi.js"

const H = -2000 
const W = 20
const hW = W * .5
const W2 = 30

export class RoadWhiteLine extends Graphics {
    constructor() {
        super();
        this.moveTo(0, 0)
        this.moveTo(W2, 0)
        this.lineTo(W2, -W)
        this.lineTo(hW, -W)
        this.lineTo(hW, H)
        this.lineTo(-hW, H)
        this.lineTo(-hW, -W)
        this.lineTo(-W2, -W)
        this.lineTo(-W2, 0)
        this.fill(0xffffff)
        this.stroke({ width: 0, color: 0xffffff })
    }
}