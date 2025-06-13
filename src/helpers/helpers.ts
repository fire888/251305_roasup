import { Point } from "pixi.js";

export const pause = (t: number) => new Promise(resolve => setTimeout(resolve, t))

export const resamplePolyline = (pts: Point[], step = 5) => {
  if (!Array.isArray(pts) || pts.length < 2 || step <= 0) return [...pts]

  const out = [new Point(pts[0].x, pts[0].y)]
  let carry = 0

  for (let i = 1; i < pts.length; i++) {
    let x0 = pts[i - 1].x, y0 = pts[i - 1].y
    const x1 = pts[i].x,   y1 = pts[i].y;
    let segLen = Math.hypot(x1 - x0, y1 - y0)

    if (segLen === 0) continue;

    while (carry + segLen >= step) {
      const t = (step - carry) / segLen
      const nx = x0 + t * (x1 - x0)
      const ny = y0 + t * (y1 - y0)

      const p = new Point(nx, ny)
      out.push(p)

      x0 = nx; y0 = ny;
      segLen = Math.hypot(x1 - x0, y1 - y0)
      carry = 0
    }
    carry += segLen
  }
  return out
}
