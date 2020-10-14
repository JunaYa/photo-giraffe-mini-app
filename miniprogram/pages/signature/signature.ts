// miniprogram/pages/signature.js
import { Bezier } from '../../lib/bezier'
import { BasicPoint, Point } from '../../lib/point'
import { throttle } from '../../lib/throttle'


export interface PointGroup {
  color: string;
  points: BasicPoint[];
}

// canvas context
let ctx: any = null
// touch drawing
let isTouching: boolean = false
let _isEmpty: boolean = false
let minDistance: number = 5
let backgroundColor = '#4f736d'
let pen = { color: '#333333', width: 1, _maxWidth: 10 }
let dpr = 1

let _maxWidth: number = 2.5
let _minWidth: number = 0.5
let _dotSize: number = (_minWidth + _maxWidth) / 2

let _lastPoints: Point[] = []
let velocityFilterWeight: number = 0.7
let _lastVelocity: number = 0
let _lastWidth: number = (_minWidth + _maxWidth) / 2
let _strokeMoveUpdate: any = null

// 时间轴，记录操作步骤数据
let timeLine: PointGroup[] = []

Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options: any) {
    console.log('onLoad', options)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    this.initContext()
    _strokeMoveUpdate = throttle(this._strokeUpdate, 16)
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * init canvas context
   */
  initContext () {
    const { pixelRatio, windowWidth, windowHeight } = wx.getSystemInfoSync()
    dpr = pixelRatio
    console.log('pixelRatio', pixelRatio)

    const query = wx.createSelectorQuery()
    query.select('#canvas').node().exec((res: any[]) => {
      const canvas = res[0].node
      console.log('canvas --- ', canvas)
      // canvas.width = windowWidth * dpr
      // canvas.height = windowHeight * dpr
      canvas.width = windowWidth
      canvas.height = windowHeight

      ctx = canvas.getContext('2d')
      // ctx.scale(pixelRatio, pixelRatio)
      console.log('ctx', ctx)

      ctx.fillStyle = backgroundColor
      ctx.fillRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32)
    })
  },

  onTouchStart (event: any) : void {
    console.log('touch start -- ', event)
    isTouching = true
    this._strokeBegin(event)
  },

  onTouchMove (event: any) : void {
    // console.log('touch move --', event)
    _strokeMoveUpdate(event)
  },

  onTouchEnd (event: any) : void {
    console.log('touch end --', event)
    isTouching = false
    this._strokeEnd(event)
  },

  onTouchCancel (event: any) : void {
    console.log('touch cancel', event)
    isTouching = false
    this._strokeEnd(event)
  },

  onError (event: any) {
    console.log('canvas error', event)
    isTouching = false
    this._strokeEnd(event)
  },

  _strokeBegin (event?: any) : void {
    console.log('_strokeBegin ++++++++')
    const newPointGroup = {
      color: pen.color,
      points: [],
    };
    timeLine.push(newPointGroup);
    this._reset();
    _strokeMoveUpdate(event)
  },

  _strokeUpdate (event: any) : void {
    if (timeLine.length === 0) {
      this._strokeBegin(event)
      return
    }
    const {x, y} = event.changedTouches[0]
    const point = this._createPoint(x, y)
    const lastPointGroup = timeLine[timeLine.length - 1]
    const lastPoints = lastPointGroup.points
    const lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1]
    const isLastPointTooClose = lastPoint ? point.distanceTo(lastPoint) <= minDistance : false
    pen.color = lastPointGroup.color
    if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
      const curve = this._addPoint(point)
      if (!lastPoints) {
        this._drawDot(point)
      } else if (curve) {
        this._drawCurve(curve)
      }
    }
  },

  _strokeEnd (event: any) : void {
    console.log('end +++++++ ', event)
    _strokeMoveUpdate(event)
  },

  _calculateCurveWidths (startPoint: Point, endPoint: Point) : { start: number; end: number } {
    const velocity = velocityFilterWeight * endPoint.velocityFrom(startPoint) + (1 - velocityFilterWeight) * _lastVelocity
    const newWidth = this._strokeWidth(velocity)
    const widths = {
      start: _lastWidth,
      end: newWidth,
    }
    _lastVelocity = velocity
    _lastWidth = newWidth
    return widths
  },

  _strokeWidth (velocity: number) {
    return Math.max(_maxWidth / (velocity + 1), _minWidth);
  },

  _createPoint(x: number, y: number): Point {
    // const {left, top} = ctx.canvas;
    const left = 0;
    const top = 0;
    return new Point(x - left, y - top, new Date().getTime());
  },

  _addPoint(point: Point) : Bezier | null {
    if (timeLine.length > 1) {
      console.log('---------- timeLine ------')
      timeLine[timeLine.length - 1].points.push(point)
    }
    _lastPoints.push(point);
    if (_lastPoints.length > 2) {
      // To reduce the initial lag make it work with 3 points
      // by copying the first point to the beginning.
      if (_lastPoints.length === 3) {
        _lastPoints.unshift(_lastPoints[0]);
      }

      // _points array will always have 4 points here.
      const widths = this._calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
      const curve = Bezier.fromPoints(_lastPoints, widths);

      // Remove the first element from the list, so that there are no more than 4 points at any time.
      _lastPoints.shift();

      return curve;
    }

    return null;
  },

  _drawDot (point: BasicPoint) : void {
    ctx.beginPath();
    const width = _dotSize
    this._drawCurveSegment(point.x, point.y, width);
    ctx.closePath();
    ctx.fillStyle = pen.color;
    ctx.fill();
  },

  _drawCurveSegment (x: number, y:number, width: number) {
    ctx.moveTo(x, y)
    ctx.arc(x, y, width, 0, 2 * Math.PI, false)
    _isEmpty = false
  },

  _drawCurve(curve: Bezier): void {
    console.log('_drawCurve ---- ', curve)
    const widthDelta = curve.endWidth - curve.startWidth
    // '2' is just an arbitrary number here. If only lenght is used, then
    // there are gaps between curve segments :/
    const drawSteps = Math.floor(curve.length()) * 2

    ctx.beginPath()
    ctx.fillStyle = pen.color

    for (let i = 0; i < drawSteps; i += 1) {
      // Calculate the Bezier (x, y) coordinate for this step.
      const t = i / drawSteps
      const tt = t * t
      const ttt = tt * t
      const u = 1 - t
      const uu = u * u
      const uuu = uu * u

      let x = uuu * curve.startPoint.x
      x += 3 * uu * t * curve.control1.x
      x += 3 * u * tt * curve.control2.x
      x += ttt * curve.endPoint.x

      let y = uuu * curve.startPoint.y
      y += 3 * uu * t * curve.control1.y
      y += 3 * u * tt * curve.control2.y
      y += ttt * curve.endPoint.y

      const width = Math.min(
        curve.startWidth + ttt * widthDelta,
        pen._maxWidth,
      );
      this._drawCurveSegment(x, y, width);
    }

    ctx.closePath();
    ctx.fill();
  },

  _lineTo (x: number, y: number) : void {
    ctx.lineTo(x * dpr, y * dpr)
  },

  _moveTo (x: number, y: number) : void {
    ctx.moveTo(x * dpr, y * dpr)
  },

  _reset () : void {
    _lastPoints = []
    _lastVelocity = 0
    _lastWidth = (_minWidth + _maxWidth) / 2
    ctx.fillStyle = pen.color
  },

  _clear () : void {
    ctx.fillStyle = backgroundColor;
    ctx.clearRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32)
    ctx.fillRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32)
    timeLine = []
    this._reset()
    _isEmpty = true
    console.log(_isEmpty)
    console.log(isTouching)
  },

})