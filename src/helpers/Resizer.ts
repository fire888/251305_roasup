import { Root } from "../types/types";
import { APP_SIZE } from "../constants/constants";

enum SCREEN_MODE {
    GORIZONTAL = 'GORIZONTAL',
    VERTICAL = 'VERTICAL',
    SQUARE = 'SQUARE',
}

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
            roadWhiteLinesManager,
            darkElement,
            letterYellow,
            letterRed,
        } = this.root

        const centerX = window.innerWidth * .5
        const centerY = window.innerHeight * .5
        const scale = Math.min(window.innerWidth / APP_SIZE, window.innerHeight / APP_SIZE)
        this.scale = scale

        userLineRed.resize(window.innerWidth, window.innerHeight, scale)
        userLineYellow.resize(window.innerWidth, window.innerHeight, scale)

        messFail.x = centerX
        messFail.y = centerY
        messFail.scale.set(scale * .4)

        darkElement.scale.set(window.innerWidth, window.innerHeight)

        hand.scale.set(scale * .5)

        let mode = SCREEN_MODE.GORIZONTAL
        const ratio = window.innerWidth / window.innerHeight 
        if (ratio < 1.15) {
            mode = SCREEN_MODE.SQUARE
        }
        if (ratio < 0.9) {
            mode = SCREEN_MODE.VERTICAL
        }

        if (mode === SCREEN_MODE.GORIZONTAL) {
            roadWhiteLinesManager.x = centerX
            roadWhiteLinesManager.y = centerY - scale * 200 
            roadWhiteLinesManager.scale.set(scale)

            carRed.x = centerX - scale * 200 
            carRed.y = window.innerHeight - scale * 200
            carRed.scale.set(scale * .6)

            carYellow.x = centerX + scale * 200 
            carYellow.y = window.innerHeight - scale * 200
            carYellow.scale.set(scale * .6)

            carBlue.x = centerX - scale * 300 
            carBlue.y = centerY - scale * 320
            carBlue.scale.set(scale * .6)

            carGreen.x = centerX + scale * 300 
            carGreen.y = centerY - scale * 320
            carGreen.scale.set(scale * .6)

            letterYellow.x = centerX - scale * 90 
            letterYellow.y = centerY - scale * 290
            letterYellow.scale.set(scale)

            letterRed.x = centerX + scale * 105
            letterRed.y = centerY - scale * 290
            letterRed.scale.set(scale)

            logo.x = centerX
            logo.y = centerY - scale * 180
            logo.scale.set(scale * .3)

            btnStart.x = centerX
            btnStart.y = centerY + scale * 280
            btnStart.scale.set(scale * 1.)
        }
        if (mode === SCREEN_MODE.VERTICAL) {
            roadWhiteLinesManager.x = centerX
            roadWhiteLinesManager.y = centerY - scale * 200 
            roadWhiteLinesManager.scale.set(scale)

            carRed.x = centerX - scale * 200 
            carRed.y = centerY + scale * 400
            carRed.scale.set(scale * .6)

            carYellow.x = centerX + scale * 200 
            carYellow.y = centerY + scale * 400
            carYellow.scale.set(scale * .6)

            carBlue.x = centerX - scale * 300 
            carBlue.y = centerY - scale * 320
            carBlue.scale.set(scale * .6)

            carGreen.x = centerX + scale * 300 
            carGreen.y = centerY - scale * 320
            carGreen.scale.set(scale * .6)

            letterYellow.x = centerX - scale * 90 
            letterYellow.y = centerY - scale * 290
            letterYellow.scale.set(scale)

            letterRed.x = centerX + scale * 105
            letterRed.y = centerY - scale * 290
            letterRed.scale.set(scale)

            logo.x = centerX
            logo.y = centerY - scale * 350
            logo.scale.set(scale * .25)

            btnStart.x = centerX
            btnStart.y = centerY + scale * 300
            btnStart.scale.set(scale * .9)
        }
        if (mode === SCREEN_MODE.SQUARE) {
            roadWhiteLinesManager.x = centerX
            roadWhiteLinesManager.y = centerY - scale * 200 
            roadWhiteLinesManager.scale.set(scale)

            carRed.x = centerX - scale * 200 
            carRed.y = centerY + scale * 400
            carRed.scale.set(scale * .6)

            carYellow.x = centerX + scale * 200 
            carYellow.y = centerY + scale * 400
            carYellow.scale.set(scale * .6)

            carBlue.x = centerX - scale * 300 
            carBlue.y = centerY - scale * 320
            carBlue.scale.set(scale * .6)

            carGreen.x = centerX + scale * 300 
            carGreen.y = centerY - scale * 320
            carGreen.scale.set(scale * .6)

            letterYellow.x = centerX - scale * 90 
            letterYellow.y = centerY - scale * 290
            letterYellow.scale.set(scale)

            letterRed.x = centerX + scale * 105
            letterRed.y = centerY - scale * 290
            letterRed.scale.set(scale)

            logo.x = centerX
            logo.y = centerY - scale * 180
            logo.scale.set(scale * .25)

            btnStart.x = centerX
            btnStart.y = centerY + scale * 300
            btnStart.scale.set(scale * .9)
        }
    }
}