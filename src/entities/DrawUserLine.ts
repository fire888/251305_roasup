import { Graphics, Container, RenderTexture, Sprite, Point, FederatedPointerEvent } from 'pixi.js';
import { Root, GAME_NAMES} from '../types/types';
import { BRUSH_SIZE } from '../constants/constants';

export class DrawUserLine extends Container  {
    private isDrawing: boolean = false
    private emptyContainer: Container = new Container()
    private brush: Graphics | null = null
    private line: Graphics | null = null
    private renderTexture: RenderTexture | null = null
    private renderTextureSprite: Sprite | null = null
    private lastDrawPoint: Point | null = null
    private root: Root | null = null
    private clickArea: Graphics | null = null
    private currentColor: string = '#ff0000'
    private historyPoints: Point[] = []
    private brushSize: number = BRUSH_SIZE

    constructor(keyColor: GAME_NAMES) {
        super()
        if (keyColor === GAME_NAMES.USER_LINE_RED) {
            this.currentColor = '#ff0000'
        }
        if (keyColor === GAME_NAMES.USER_LINE_YELLOW) {
            this.currentColor = '#ffff00'
        }
    }

    init (root: Root) {
        this.root = root

        this.clickArea = new Graphics()
            .rect(0, 0, 1, 1)
            .fill('#ff0000')
        this.clickArea.alpha = 0.001
        this.addChild(this.clickArea)

        this.brush = new Graphics().circle(0, 0, BRUSH_SIZE * .5).fill({ color: 0xffffff })
        this.brush.visible = false
        this.addChild(this.brush)

        this.line = new Graphics()
        this.line.visible = false
        this.addChild(this.line)

        this.renderTexture = RenderTexture.create({ 
            width: window.innerWidth, 
            height: window.innerHeight, 
            resolution: window.devicePixelRatio 
        });
        this.renderTextureSprite = new Sprite(this.renderTexture)
        this.addChild(this.renderTextureSprite);
    }

    resize(w: number, h: number, scale: number) {
        this.renderTexture?.resize(w, h, window.devicePixelRatio)
        this.renderTextureSprite?.setSize(w, h)
        if (this.clickArea) {
            this.clickArea.scale.set(w, h)
        }
        this.brushSize = BRUSH_SIZE * scale
    }

    startDraw(startPoint: Point) {
        if (this.brush) {
            this.brush
                .clear()
                .circle(0, 0, this.brushSize * .5)
                .fill({ color: this.currentColor })
        }

        if (this.line) {
            this.line.visible = true
        }

        this.lastDrawPoint = new Point()
        this.lastDrawPoint.set(startPoint.x, startPoint.y)

        this.isDrawing = true

        if (this.clickArea) {
            this.clickArea.eventMode = 'static'
            this.clickArea.on('pointermove', this.drawStroke.bind(this))
            this.clickArea.on('pointerup', this.endStroke.bind(this))  
            this.clickArea.on('pointerupoutside', this.endStroke.bind(this))  
        }
    }

    completeDraw(): Point[] {
        this.brush!.visible = false
        this.line!.visible = false
        this.isDrawing = false
        this.clickArea!.eventMode = 'none'
        this.clickArea!.off('pointermove', this.drawStroke.bind(this))
        this.clickArea!.off('pointerup', this.endStroke.bind(this))  
        this.clickArea!.off('pointerupoutside', this.endStroke.bind(this))  
        return this.historyPoints
    }

    clear() {
        this.historyPoints = []
        this.root!.app.renderer.render({
            container: this.emptyContainer,
            target: this.renderTexture!,
            clear: true,
        })
    } 

    private drawStroke(e: FederatedPointerEvent) {
        if (!this.isDrawing) { 
            return;
        }
        if (!this.brush) {
            return
        }
        if (!this.renderTexture) {
            return
        }
        if (!this.line) {
            return
        }
        if (!this.root) {
            return
        }
        this.brush.visible = true
        this.line.visible = true

        const { x, y } = e.global
        this.brush.position.set(x, y)

        this.root.app.renderer.render({
            container: this.brush,
            target: this.renderTexture,
            clear: false,
        })

        if (this.lastDrawPoint) {
            this.line
                .clear()
                .moveTo(this.lastDrawPoint.x, this.lastDrawPoint.y)
                .lineTo(x, y)
                .stroke({ width: this.brushSize, color: this.currentColor })

            this.historyPoints.push(this.lastDrawPoint.clone())    
            this.lastDrawPoint.set(x, y)    

            this.root.app.renderer.render({
                container: this.line,
                target: this.renderTexture,
                clear: false,
            })
        } else {
            this.lastDrawPoint = new Point()
            this.lastDrawPoint.set(x, y)
            this.historyPoints.push(this.lastDrawPoint.clone())    
        }
    }

    private endStroke() {
        if (!this.isDrawing) { 
            return;
        }
        this.isDrawing = false
        this.lastDrawPoint = null
    }
} 
