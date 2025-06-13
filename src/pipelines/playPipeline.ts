import { Root, GAME_NAMES } from "../types/types"
import { SceneElem } from "../entities/SceneElem"
import { DrawUserLine } from "../entities/DrawUserLine"
import * as TWEEN from '@tweenjs/tween.js'
import { Point } from "pixi.js"
import { pause, resamplePolyline } from "../helpers/helpers"
import { 
    REDIRECT_URL,
    TIME_WAIT_START_USER_CLICK,
} from "../constants/constants"

type TdataForDrawStroke = {
    completeCollision: SceneElem,
    failCollisions: SceneElem[],
    userLine: DrawUserLine,
    startDrawPoint: Point,
}

const waitClickCar = async (
    root: Root, 
    flagsActiveElements: { 
        red: boolean, 
        yellow: boolean,
        hand: boolean, 
    }
) => {
    const { 
        carRed, 
        letterRed,
        hand,
        carYellow, 
    } = root

    // ANIMATION HAND ======================== //
    let isUpdateNextFrame = true
    if (flagsActiveElements.hand) {
        hand.x = carRed.x + 50
        hand.y = carRed.y + 50
        hand.show(150)
        await pause(200)
        hand.startWaitMode()
        
        let tween: TWEEN.Tween | null = null

        const moveHand = (dir: number) => {
            const objStart = { x: carRed.x + 70, y: carRed.y + 70 }
            tween = new TWEEN.Tween(objStart)
                .to({ x: letterRed.x + 70, y: letterRed.y + 70 }, 1000)
                .easing(TWEEN.Easing.Linear.None)
                .onComplete(() => {
                    tween = null
                    moveHand(-dir)     
                })
                .onUpdate(() => {
                    hand.x = objStart.x
                    hand.y = objStart.y
                })
                .start()
        }
        moveHand(100)

        const animate = (time: number) => {
            if (!isUpdateNextFrame) {
                return;
            }
            requestAnimationFrame(animate)
            if (tween) { 
                tween.update(time)
            }
        }
        animate(0)
    }

    // WAIT USER CLICK OR RESOLVE AFTER DELAY  //
    let timerAutoResolve: ReturnType<typeof setTimeout> | null = null
    let resolve: ((name: GAME_NAMES) => void) | null = null
    const wait = () => {
        return new Promise((res) => {
            resolve = res
            timerAutoResolve = setTimeout(() => {
                if (resolve !== null) {
                    resolve(GAME_NAMES.NONE)
                }
            }, TIME_WAIT_START_USER_CLICK)
        }) 
    }
    const onClick = (elementName: GAME_NAMES) => {
        if (resolve !== null) {
            resolve(elementName)
        }
    }

    let clearWaitClickRed: () => void = () => {}
    let clearWaitClickYellow: () => void = () => {}

    if (flagsActiveElements.red) {
        clearWaitClickRed = carRed.onClickOnce(onClick)
    }
    if (flagsActiveElements.yellow) {
        clearWaitClickYellow = carYellow.onClickOnce(onClick)
    }

    const clickElementName = await wait()

    if (timerAutoResolve) {
        clearTimeout(timerAutoResolve)
    }

    clearWaitClickRed()
    clearWaitClickYellow()
    carRed.stopWaitMode()
    carYellow.stopWaitMode()
    
    if (flagsActiveElements.hand) {
        isUpdateNextFrame = false
        hand.stopWaitMode() 
        hand.hide(150)
    }

    await pause(200)    

    return clickElementName
}

const drawStroke = (dataForDrawStroke: TdataForDrawStroke): Promise<Point[] | null> => {
    return new Promise((resolve) => {
        const {
            completeCollision,
            failCollisions,
            userLine,
            startDrawPoint,
        } = dataForDrawStroke

        userLine.startDraw(startDrawPoint)

        const dropDraw = () => {
            userLine.completeDraw()

            for (let i = 0; i < failCollisions.length; ++i) {
                failCollisions[i].eventMode = 'none'
                failCollisions[i].off('pointerover', dropDraw)
            }
            completeCollision.eventMode = 'none'
            completeCollision.off('pointerover', completeDraw)

            resolve(null) 
        }

        const completeDraw = () => {
            const userPoints = userLine.completeDraw()
            
            for (let i = 0; i < failCollisions.length; ++i) {
                failCollisions[i].eventMode = 'none'
                failCollisions[i].off('pointerover', dropDraw)
            }
            completeCollision.eventMode = 'none'
            completeCollision.off('pointerover', completeDraw)
            
            resolve(userPoints)
        }

        for (let i = 0; i < failCollisions.length; ++i) {
            failCollisions[i].eventMode = 'static'
            failCollisions[i].on('pointerover', dropDraw)
        }

        completeCollision.eventMode = 'static'
        completeCollision.on('pointerover', completeDraw)
    })
}

const moveCarsAlongPaths = (root: Root, redCarPoints: Point[], yellowCarPoints: Point[]): Promise<Point> => {
    return new Promise((resolve) => {
        const {
            carRed,
            carYellow,
            resizer,
        } = root

        const redCarPointsSampled = resamplePolyline(redCarPoints, 5)
        const yellowCarPointsSampled = resamplePolyline(yellowCarPoints, 5)

        const updateCar = (car: SceneElem, points: Point[], phase: number) => {
            const currentPointIndex = Math.floor(points.length * phase)
            const point = points[currentPointIndex]
            if (point === undefined) {
                return;
            }
            const nextPoint = points[currentPointIndex + 1]
            if (nextPoint === undefined) {
                return;
            }

            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) + Math.PI * .5
            car.rotation = angle

            car.x = point.x
            car.y = point.y
        } 

        const TIME = 5000
        let isUpdateNextFrame = true
        const tweenObject = { phase: 0 }
        let tween: TWEEN.Tween | null = new TWEEN.Tween(tweenObject)
            .to({ phase: 1 }, TIME)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                updateCar(carRed, redCarPointsSampled, tweenObject.phase)
                updateCar(carYellow, yellowCarPointsSampled, tweenObject.phase)
                const d = Math.sqrt(Math.pow(carRed.x - carYellow.x, 2) + Math.pow(carRed.y - carYellow.y, 2))
                if (d < 100 * resizer.scale) {
                    isUpdateNextFrame = false
                    tween?.stop()
                    tween = null

                    const collisionPoint = new Point(
                        (carRed.x + carYellow.x) / 2, 
                        (carRed.y + carYellow.y) / 2
                    )
                    resolve(collisionPoint)
                }
            })
            .start()
        
        const animate = (time: number) => {
            if (!isUpdateNextFrame) {
                return;
            }
            requestAnimationFrame(animate)
            if (tween) { 
                tween.update(time)
            }
        }
        animate(0)
    })
}

const finalScene = async(root: Root) => {
    const {
        messFail,
        darkElement,
        logo,
        btnStart,
    } = root

    messFail.show()
    await pause(1000)
    messFail.hide()
    await pause(500)
    darkElement.showByAlpha(200, .7)
    logo.show(300)
    await pause(150)
    btnStart.show(300)
    await pause(400)
    btnStart.startWaitMode()
    logo.lazyWaiting()

    btnStart.onClickOnce(() => {
        window.location.href = REDIRECT_URL
    })
} 

export const playPipeline = async (root: Root) => {
    const {
        letterRed,
        letterYellow,
        carBlue,
        carGreen,
        carRed,
        carYellow,
        userLineRed,
        userLineYellow,
    } = root

    const dataForDrawStrokeRed: TdataForDrawStroke = {
        completeCollision: letterRed,
        failCollisions: [letterYellow, carBlue, carGreen, carYellow],
        userLine: userLineRed,
        startDrawPoint: new Point(carRed.x, carRed.y),
    }
    const dataForDrawStrokeYellow: TdataForDrawStroke = {
        completeCollision: letterYellow,
        failCollisions: [letterRed, carBlue, carGreen, carRed],
        userLine: userLineYellow,
        startDrawPoint: new Point(carYellow.x, carYellow.y),
    }

    let redCarPoints = null
    let yellowCarPoints = null
    let isFirstClick = true

    while (!redCarPoints || !yellowCarPoints) {
        const clickedCarName: GAME_NAMES = await waitClickCar(
            root, 
            { 
                red: !redCarPoints, 
                yellow: !yellowCarPoints, 
                hand: isFirstClick 
            }
        ) as GAME_NAMES

        isFirstClick = false    
 
        if (clickedCarName === GAME_NAMES.NONE) {
            break
        }

        if (clickedCarName === GAME_NAMES.CAR_RED && !redCarPoints) {
            redCarPoints = await drawStroke(dataForDrawStrokeRed)
        }
        if (clickedCarName === GAME_NAMES.CAR_YELLOW && !yellowCarPoints) {
            yellowCarPoints = await drawStroke(dataForDrawStrokeYellow)
        }

        if (!redCarPoints) {
            userLineRed.clear()
        }
        if (!yellowCarPoints) {
            userLineYellow.clear()
        }
    }

    // sckip if user do not select car long time
    if (redCarPoints && yellowCarPoints) {
        await moveCarsAlongPaths(root, redCarPoints, yellowCarPoints)
    }

    await finalScene(root)
}