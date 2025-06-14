import { Root, GAME_NAMES } from "../types/types";
import { App } from "../helpers/App";
import { AssetsManager } from "../helpers/AssetsManager";
import { SceneElem } from "../entities/SceneElem";
import { Letter } from "../entities/Letter";
import { RoadWhiteLinesManager } from "../entities/RoadWhiteLinesManager";
import { Resizer } from "../helpers/Resizer";
import { DrawUserLine } from "../entities/DrawUserLine";
import { 
    COLOR_LETTER_P_YELLOW, 
    COLOR_LETTER_P_RED, 
} from "../constants/constants";
import { pause } from "../helpers/helpers";
import { Graphics, Sprite } from "pixi.js";

export const initPipeline = async () => {
    const app = new App()
    await app.init()

    const userLineRed = new DrawUserLine(GAME_NAMES.USER_LINE_RED)
    app.stage.addChild(userLineRed)

    const userLineYellow = new DrawUserLine(GAME_NAMES.USER_LINE_YELLOW)
    app.stage.addChild(userLineYellow)

    const assetsManager = new AssetsManager()
    await assetsManager.loadAssets()

    const resizer = new Resizer()

    const letterYellowText = new Letter('P', COLOR_LETTER_P_YELLOW)
    const letterYellow = new SceneElem(GAME_NAMES.LETTER_YELLOW, letterYellowText)
    const collisionYL = new Graphics().rect(-70, -1000, 140, 1050).fill(0x00ff00)
    collisionYL.alpha = .0005
    letterYellow.setCollisionElem(collisionYL)
    app.stage.addChild(letterYellow)

    const letterRedText = new Letter('P', COLOR_LETTER_P_RED)
    const letterRed = new SceneElem(GAME_NAMES.LETTER_RED, letterRedText)
    const collisionRL = new Graphics().rect(-70, -1000, 140, 1050).fill(0x00ff00)
    collisionRL.alpha = .0005
    letterRed.setCollisionElem(collisionRL)
    app.stage.addChild(letterRed)

    const roadWhiteLineManager = new RoadWhiteLinesManager()
    roadWhiteLineManager.position.set(0, -150)
    app.stage.addChild(roadWhiteLineManager)

    const carGreen = new SceneElem(GAME_NAMES.CAR_GREEN, new Sprite())
    carGreen.rotation = Math.PI
    carGreen.setTexture(assetsManager.carGreen!)
    const collisionGreen = new Graphics().rect(-70, -150, 140, 1000).fill(0x00ff00)
    collisionGreen.alpha = .00005
    carGreen.setCollisionElem(collisionGreen)
    app.stage.addChild(carGreen)

    const carBlue = new SceneElem(GAME_NAMES.CAR_BLUE, new Sprite())
    carBlue.rotation = Math.PI
    carBlue.setTexture(assetsManager.carBlue!)
    const collisionBlue = new Graphics().rect(-70, -150, 140, 1000).fill(0x00ff00)
    collisionBlue.alpha = .0005
    carBlue.setCollisionElem(collisionBlue)
    app.stage.addChild(carBlue)

    const carRed = new SceneElem(GAME_NAMES.CAR_RED, new Sprite())
    carRed.setTexture(assetsManager.carRed!)
    const collisionRed = new Graphics().rect(-70, -150, 140, 1000).fill(0xff0000)
    collisionRed.alpha = .0005
    carRed.setCollisionElem(collisionRed)
    app.stage.addChild(carRed)

    const carYellow = new SceneElem(GAME_NAMES.CAR_YELLOW, new Sprite())
    carYellow.setTexture(assetsManager.carYellow!)
    const collisionYellow = new Graphics().rect(-70, -150, 140, 1000).fill(0xffff00)
    collisionYellow.alpha = .0005
    carYellow.setCollisionElem(collisionYellow)
    app.stage.addChild(carYellow)
    
    const hand = new SceneElem(GAME_NAMES.HAND, new Sprite())
    hand.setTexture(assetsManager.hand!)
    hand.setAnchor(.7, .7)
    app.stage.addChild(hand)

    const messFail = new SceneElem(GAME_NAMES.MESS_FAIL, new Sprite())
    messFail.setTexture(assetsManager.messFail!)
    app.stage.addChild(messFail)

    const darkPixel = new Graphics()
        .rect(0, 0, 1, 1)
        .fill('#000000')    
    const darkElement = new SceneElem(GAME_NAMES.DARK_ELEMENT, darkPixel)
    app.stage.addChild(darkElement)

    const logo = new SceneElem(GAME_NAMES.LOGO, new Sprite())
    logo.scale.set(0.3)
    logo.setTexture(assetsManager.logo!)
    app.stage.addChild(logo)

    const btnStart = new SceneElem(GAME_NAMES.BTN_START, new Sprite())
    btnStart.setTexture(assetsManager.btnStart!)
    app.stage.addChild(btnStart)

    const root: Root = {
        app: app,
        assetsManager: assetsManager,
        resizer: resizer,
        hand: hand,
        logo: logo,
        btnStart: btnStart,
        messFail: messFail,
        carBlue: carBlue,
        carGreen: carGreen,
        carRed: carRed,
        carYellow: carYellow,
        letterYellow: letterYellow,
        letterRed: letterRed,
        roadWhiteLinesManager: roadWhiteLineManager,
        userLineRed: userLineRed,
        userLineYellow: userLineYellow,
        darkElement: darkElement
    }

    userLineRed.init(root)
    userLineYellow.init(root)
    
    resizer.setRoot(root)
    document.getElementById("pixi-container")!.appendChild(app.canvas)
    resizer.resize()

    letterYellow.show()
    await pause(70)
    letterRed.show()
    await pause(70)
    carBlue.show()
    await pause(70)
    carGreen.show()
    await pause(70) 
    carYellow.show()
    await pause(70)
    carRed.show()
    await pause(400)
    carYellow.startWaitMode()
    carRed.startWaitMode()

    return root
}