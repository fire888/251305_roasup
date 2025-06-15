import { Text } from "pixi.js";

export class Letter extends Text {
    constructor(letter: string, color: string) {
        const style = {
            ...Letter.style,
            fill: color,
        }

        // @ts-ignore
        super({ 
            text: letter, 
            style,
        })

        this.anchor.set(0.5)
    }

    static style = {
        fontFamily: 'Arial',
        fontSize: 150,
        fill: 0xff1010,
        fontWeight: 800,
    }
}