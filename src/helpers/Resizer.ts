import { Root } from "../types/types";
import { APP_SIZE } from "../constants/constants";

export class Resizer {
    private root: Root | null = null
    public scale: number = 1
    constructor() {
        window.addEventListener('resize', () => {
            this.resize()
        })
    }
    
    setRoot(root: Root) {
        this.root = root
    }

    resize() {
        if (!this.root) { 
            return
        }

        const {
            logo,
            btnStart,
            messFail,
            hand,
            carRed,
            carYellow,
            carBlue,
            carGreen,
            userLineRed,
            userLineYellow,
            mainSceneContainer,
            darkElement,
            letterYellow,
            letterRed,
        } = this.root

        const centerX = window.innerWidth * .5
        const centerY = window.innerHeight * .5
        const scale = Math.min(window.innerWidth / APP_SIZE, window.innerHeight / APP_SIZE)
        this.scale = scale

        if (mainSceneContainer) {
            mainSceneContainer.x = centerX
            mainSceneContainer.y = centerY    
            mainSceneContainer.scale.set(scale)
        }

        if (userLineRed) {
            userLineRed.resize(window.innerWidth, window.innerHeight, scale)
        }

        if (userLineYellow) {
            userLineYellow.resize(window.innerWidth, window.innerHeight, scale)
        }

        if (carRed) {
            carRed.x = centerX - scale * 200 
            carRed.y = window.innerHeight - scale * 120
            carRed.scale.set(scale * .6)
        }

        if (carYellow) {
            carYellow.x = centerX + scale * 200 
            carYellow.y = window.innerHeight - scale * 120
            carYellow.scale.set(scale * .6)
        }

        if (carBlue) {
            carBlue.x = centerX - scale * 300 
            carBlue.y = centerY - scale * 290
            carBlue.scale.set(scale * .6)
        }

        if (carGreen) {
            carGreen.x = centerX + scale * 300 
            carGreen.y = centerY - scale * 290
            carGreen.scale.set(scale * .6)
        }

        if (letterYellow) {
            letterYellow.x = centerX - scale * 90 
            letterYellow.y = centerY - scale * 290
            letterYellow.scale.set(scale)
        }

        if (letterRed) {
            letterRed.x = centerX + scale * 105
            letterRed.y = centerY - scale * 290
            letterRed.scale.set(scale)
        }

        if (hand) {
            hand.x = centerX
            hand.y = centerY
            hand.scale.set(scale * .5)
        }

        if (logo) {
            logo.x = centerX
            logo.y = centerY - scale * 100
            logo.scale.set(scale * .25)
        }

        if (btnStart) {
            btnStart.x = centerX
            btnStart.y = centerY + scale * 250
            btnStart.scale.set(scale * .6)
        }

        if (messFail) {
            messFail.x = centerX
            messFail.y = centerY
            messFail.scale.set(scale * .4)
        }

        if (darkElement) {
            darkElement.scale.set(window.innerWidth, window.innerHeight)
        }
    }
}