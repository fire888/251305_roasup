import { Container, Sprite, Texture, Graphics, Text } from "pixi.js"
import { Tween, Easing } from '@tweenjs/tween.js'
import { GAME_NAMES } from "../types/types"

export class SceneElem extends Container {
    public gameName: GAME_NAMES
    public elem: Sprite | Graphics | Text
    public collisionElem: Graphics | null = null
    public collisionElem2: Graphics | null = null
    private tween: Tween | null = null
    private isUpdateNextFrame = true
    private waitModeTimer: ReturnType<typeof setTimeout> | null = null
    
    constructor(name: GAME_NAMES, elem: Sprite | Graphics | Text) {
        super()
        this.gameName = name
        this.elem = elem
        this.elem.scale.set(0)
        this.elem.alpha = 0
        if (this.elem instanceof Sprite) { 
            this.elem.anchor.set(.5) 
        }
        this.addChild(this.elem)
    }

    setTexture(texture: Texture) {
        if (this.elem instanceof Sprite) {
            this.elem.texture = texture
        }
    }

    setCollisionElem(elem: Graphics) {
        this.collisionElem = elem
        this.addChild(this.collisionElem)
    }

    setCollisionElem2(elem: Graphics) {
        this.collisionElem2 = elem
        this.addChild(this.collisionElem2)
    }

    setAnchor(v1: number, v2: number) {
        if (this.elem instanceof Sprite) {
            this.elem.anchor.set(v1, v2)
        }
    }

    showFast() {
        this.elem.scale.set(1)
        this.elem.alpha = 1
        this.visible = true
        this.renderable = true
    }

    show(duration: number = 300) {
        if (this.tween) {
            this.tween.stop()
            this.tween = null
        }

        this.isUpdateNextFrame = true

        this.elem.scale.set(0)
        this.elem.alpha = 1
        
        const object = { scale: 0 }

        this.tween = new Tween(object)
            .to({ scale: 1 }, duration)
            .easing(Easing.Sinusoidal.InOut)
            .onComplete(() => {
                this.isUpdateNextFrame = false
            })
            .onUpdate(() => {
                this.elem.scale.set(object.scale)
            })
            .start()
        
        const animate = (time: number) => {
            if (!this.isUpdateNextFrame) {
                return
            }
            requestAnimationFrame(animate)
            if (!this.tween) {
                return;
            }
            this.tween.update(time)
        }
        animate(0)   
    }

    showByAlpha(duration: number = 300, maxAlpha: number = 1) {
        if (this.tween) {
            this.tween.stop()
            this.tween = null
        }

        this.isUpdateNextFrame = true

        this.elem.scale.set(1)
        this.elem.alpha = 0
        
        const object = { phase: 0 }

        this.tween = new Tween(object)
            .to({ phase: 1 }, duration)
            .easing(Easing.Sinusoidal.InOut)
            .onComplete(() => {
                this.isUpdateNextFrame = false
            })
            .onUpdate(() => {
                this.elem.alpha = object.phase * maxAlpha
            })
            .start()
        
        const animate = (time: number) => {
            if (!this.isUpdateNextFrame) {
                return
            }
            requestAnimationFrame(animate)
            if (!this.tween) {
                return;
            }
            this.tween.update(time)
        }
        animate(0)   
    }

    hide(duration: number = 200) {
        if (this.tween) {
            this.tween.stop()
            this.tween = null
        }

        this.isUpdateNextFrame = true

        const object = { phase: 0 }
        this.tween = new Tween(object)
            .to({ phase: 1 }, duration)
            .easing(Easing.Quartic.In)
            .onComplete(() => {
                this.tween = null
            })
            .onUpdate(() => {
                this.elem.scale.set((object.phase * .5) + 1)
                this.elem.alpha = 1. - object.phase
            })
            .start()

        const animate = (time: number) => {
            if (!this.isUpdateNextFrame) {
                return
            }
            requestAnimationFrame(animate)
            if (!this.tween) {
                return;
            }
            this.tween.update(time)
        }
        animate(0) 
    }

    startWaitMode() { 
        if (this.tween) {
            this.tween.stop()
            this.tween = null
        }

        const iterate = () => {
            this.isUpdateNextFrame = true

            const object = { phase: 0 }
            this.tween = new Tween(object)
                .to({ phase: Math.PI * 6 }, 600)
                .easing(Easing.Quartic.In)
                .onComplete(() => {
                    this.tween = null
                    this.isUpdateNextFrame = false
                    this.elem.rotation = 0
                    this.waitModeTimer = setTimeout(iterate, 3000)
                })
                .onUpdate(() => {
                    this.elem.rotation = Math.sin(object.phase) * .1 
                })
                .start()

            const animate = (time: number) => {
                if (!this.isUpdateNextFrame) {
                    return
                }
                requestAnimationFrame(animate)
                if (!this.tween) {
                    return;
                }
                this.tween.update(time)
            }
            animate(0) 
        }
        iterate()
    }

    stopWaitMode() { 
        if (this.waitModeTimer) {
            clearTimeout(this.waitModeTimer)
            this.waitModeTimer = null
        }
    }
    
    lazyWaiting() {
        if (this.tween) {
            this.tween.stop()
            this.tween = null
            this.isUpdateNextFrame = false
        }

        const iterate = () => {
            this.isUpdateNextFrame = true

            const object = { phase: 0 }
            this.tween = new Tween(object)
                .to({ phase: Math.PI * 6 }, 6000)
                .easing(Easing.Linear.None)
                .onComplete(() => {
                    this.tween = null
                    this.isUpdateNextFrame = false
                    this.elem.rotation = 0
                    this.waitModeTimer = setTimeout(iterate, 50)
                })
                .onUpdate(() => {
                    this.elem.y = Math.sin(object.phase) * 30 
                })
                .start()

            const animate = (time: number) => {
                if (!this.isUpdateNextFrame) {
                    return
                }
                requestAnimationFrame(animate)
                if (!this.tween) {
                    return;
                }
                this.tween.update(time)
            }
            animate(0) 
        }
        iterate()        
    }

    onClickOnce(cb: (name: GAME_NAMES ) => void) {
        const clickHundler = () => {
            this.off('pointerdown', clickHundler)
            this.eventMode = 'none'
            this.cursor = 'none'
            cb(this.gameName)
        }

        const undoClickOnce = () => {
            this.off('pointerdown', clickHundler)
            this.eventMode = 'none'
            this.cursor = 'none'  
        }

        this.eventMode = 'static'
        this.cursor = 'pointer'
        this.on('pointerdown', clickHundler)

        return undoClickOnce
    }
}