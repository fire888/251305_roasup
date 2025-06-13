import { Assets, Texture } from "pixi.js"

const ASSET_HAND_SRC = new URL('../assets/hand.png', import.meta.url).href
const ASSET_LOGO_SRC = new URL('../assets/gamelogo.png', import.meta.url).href
const ASSET_BTN_START_SRC = new URL('../assets/Button.png', import.meta.url).href
const ASSET_FAIL_SRC = new URL('../assets/fail3.png', import.meta.url).href
const ASSET_CAR_RED_SRC = new URL('../assets/carRed.png', import.meta.url).href
const ASSET_CAR_GREEN_SRC = new URL('../assets/carGreen.png', import.meta.url).href
const ASSET_CAR_BLUE_SRC = new URL('../assets/carBlue.png', import.meta.url).href
const ASSET_CAR_YELLOW_SRC = new URL('../assets/carYellow.png', import.meta.url).href
const ASSET_CAR_WHITE_SRC = new URL('../assets/carWhite.png', import.meta.url).href

export class AssetsManager {
    hand: Texture | null = null
    logo: Texture | null = null
    btnStart: Texture | null = null
    messFail: Texture | null = null
    carBlue: Texture | null = null
    carGreen: Texture | null = null
    carRed: Texture | null = null
    carWhite: Texture | null = null
    carYellow: Texture | null = null

    async loadAssets () {
        this.hand = await Assets.load(ASSET_HAND_SRC)        
        this.logo = await Assets.load(ASSET_LOGO_SRC)        
        this.btnStart = await Assets.load(ASSET_BTN_START_SRC)        
        this.messFail = await Assets.load(ASSET_FAIL_SRC)        
        this.carBlue = await Assets.load(ASSET_CAR_BLUE_SRC)        
        this.carGreen = await Assets.load(ASSET_CAR_GREEN_SRC)        
        this.carRed = await Assets.load(ASSET_CAR_RED_SRC)        
        this.carWhite = await Assets.load(ASSET_CAR_WHITE_SRC)        
        this.carYellow = await Assets.load(ASSET_CAR_YELLOW_SRC)
    }
}