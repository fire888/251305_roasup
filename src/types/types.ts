import { App } from "../helpers/App.ts";
import { AssetsManager } from "../helpers/AssetsManager.ts";
import { SceneElem } from "../entities/SceneElem.ts";
import { RoadWhiteLinesManager } from "../entities/RoadWhiteLinesManager.ts";
import { Resizer } from "../helpers/Resizer.ts";
import { DrawUserLine } from "../entities/DrawUserLine.ts";
import { MainSceneContainer } from "../entities/MainSceneContainer.ts";

export type Root = {
    app: App
    mainSceneContainer: MainSceneContainer
    assetsManager: AssetsManager
    resizer: Resizer
    hand: SceneElem
    logo: SceneElem
    btnStart: SceneElem
    messFail: SceneElem
    carBlue: SceneElem
    carGreen: SceneElem
    carRed: SceneElem
    carYellow: SceneElem
    letterYellow: SceneElem
    letterRed: SceneElem
    roadWhiteLinesManager: RoadWhiteLinesManager
    userLineRed: DrawUserLine
    userLineYellow: DrawUserLine
    darkElement: SceneElem//DarkElement
}

export enum GAME_NAMES {
    RED_CAR = 'RED_CAR',
    YELLOW_CAR = 'YELLOW_CAR',
    RED_LETTER = 'RED_LETTER',
    YELLOW_LETTER = 'YELLOW_LETTER',
    LOGO = 'LOGO',
    HAND = 'HAND',
    BTN_START = 'BTN_START',
    MESS_FAIL = 'MESS_FAIL',
    CAR_BLUE = 'CAR_BLUE',
    CAR_GREEN = 'CAR_GREEN',
    CAR_RED = 'CAR_RED',
    CAR_WHITE = 'CAR_WHITE',
    CAR_YELLOW = 'CAR_YELLOW',
    LETTER_YELLOW = 'LETTER_YELLOW',
    LETTER_RED = 'LETTER_RED',
    ROAD_WHITE_LINES_MANAGER = 'ROAD_WHITE_LINES_MANAGER',
    USER_LINE_RED = 'USER_LINE_RED',
    USER_LINE_YELLOW = 'USER_LINE_YELLOW',
    DARK_ELEMENT = 'DARK_ELEMENT',
    NONE = 'NONE'
}
