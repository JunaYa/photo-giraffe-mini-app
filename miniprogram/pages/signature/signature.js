"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bezier_1 = require("../../lib/bezier");
var point_1 = require("../../lib/point");
var throttle_1 = require("../../lib/throttle");
var ctx = null;
var isTouching = false;
var _isEmpty = false;
var minDistance = 5;
var backgroundColor = '#4f736d';
var pen = { color: '#333333', width: 1, _maxWidth: 10 };
var dpr = 1;
var _maxWidth = 2.5;
var _minWidth = 0.5;
var _dotSize = (_minWidth + _maxWidth) / 2;
var _lastPoints = [];
var velocityFilterWeight = 0.7;
var _lastVelocity = 0;
var _lastWidth = (_minWidth + _maxWidth) / 2;
var _strokeMoveUpdate = null;
var timeLine = [];
Page({
    data: {},
    onLoad: function (options) {
        console.log('onLoad', options);
    },
    onReady: function () {
        this.initContext();
        _strokeMoveUpdate = throttle_1.throttle(this._strokeUpdate, 16);
    },
    onShow: function () {
    },
    onHide: function () {
    },
    onUnload: function () {
    },
    initContext: function () {
        var _a = wx.getSystemInfoSync(), pixelRatio = _a.pixelRatio, windowWidth = _a.windowWidth, windowHeight = _a.windowHeight;
        dpr = pixelRatio;
        console.log('pixelRatio', pixelRatio);
        var query = wx.createSelectorQuery();
        query.select('#canvas').node().exec(function (res) {
            var canvas = res[0].node;
            console.log('canvas --- ', canvas);
            canvas.width = windowWidth;
            canvas.height = windowHeight;
            ctx = canvas.getContext('2d');
            console.log('ctx', ctx);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32);
        });
    },
    onTouchStart: function (event) {
        console.log('touch start -- ', event);
        isTouching = true;
        this._strokeBegin(event);
    },
    onTouchMove: function (event) {
        _strokeMoveUpdate(event);
    },
    onTouchEnd: function (event) {
        console.log('touch end --', event);
        isTouching = false;
        this._strokeEnd(event);
    },
    onTouchCancel: function (event) {
        console.log('touch cancel', event);
        isTouching = false;
        this._strokeEnd(event);
    },
    onError: function (event) {
        console.log('canvas error', event);
        isTouching = false;
        this._strokeEnd(event);
    },
    _strokeBegin: function (event) {
        console.log('_strokeBegin ++++++++');
        var newPointGroup = {
            color: pen.color,
            points: [],
        };
        timeLine.push(newPointGroup);
        this._reset();
        _strokeMoveUpdate(event);
    },
    _strokeUpdate: function (event) {
        if (timeLine.length === 0) {
            this._strokeBegin(event);
            return;
        }
        var _a = event.changedTouches[0], x = _a.x, y = _a.y;
        var point = this._createPoint(x, y);
        var lastPointGroup = timeLine[timeLine.length - 1];
        var lastPoints = lastPointGroup.points;
        var lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
        var isLastPointTooClose = lastPoint ? point.distanceTo(lastPoint) <= minDistance : false;
        pen.color = lastPointGroup.color;
        if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
            var curve = this._addPoint(point);
            if (!lastPoints) {
                this._drawDot(point);
            }
            else if (curve) {
                this._drawCurve(curve);
            }
        }
    },
    _strokeEnd: function (event) {
        console.log('end +++++++ ', event);
        _strokeMoveUpdate(event);
    },
    _calculateCurveWidths: function (startPoint, endPoint) {
        var velocity = velocityFilterWeight * endPoint.velocityFrom(startPoint) + (1 - velocityFilterWeight) * _lastVelocity;
        var newWidth = this._strokeWidth(velocity);
        var widths = {
            start: _lastWidth,
            end: newWidth,
        };
        _lastVelocity = velocity;
        _lastWidth = newWidth;
        return widths;
    },
    _strokeWidth: function (velocity) {
        return Math.max(_maxWidth / (velocity + 1), _minWidth);
    },
    _createPoint: function (x, y) {
        var left = 0;
        var top = 0;
        return new point_1.Point(x - left, y - top, new Date().getTime());
    },
    _addPoint: function (point) {
        if (timeLine.length > 1) {
            console.log('---------- timeLine ------');
            timeLine[timeLine.length - 1].points.push(point);
        }
        _lastPoints.push(point);
        if (_lastPoints.length > 2) {
            if (_lastPoints.length === 3) {
                _lastPoints.unshift(_lastPoints[0]);
            }
            var widths = this._calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
            var curve = bezier_1.Bezier.fromPoints(_lastPoints, widths);
            _lastPoints.shift();
            return curve;
        }
        return null;
    },
    _drawDot: function (point) {
        ctx.beginPath();
        var width = _dotSize;
        this._drawCurveSegment(point.x, point.y, width);
        ctx.closePath();
        ctx.fillStyle = pen.color;
        ctx.fill();
    },
    _drawCurveSegment: function (x, y, width) {
        ctx.moveTo(x, y);
        ctx.arc(x, y, width, 0, 2 * Math.PI, false);
        _isEmpty = false;
    },
    _drawCurve: function (curve) {
        console.log('_drawCurve ---- ', curve);
        var widthDelta = curve.endWidth - curve.startWidth;
        var drawSteps = Math.floor(curve.length()) * 2;
        ctx.beginPath();
        ctx.fillStyle = pen.color;
        for (var i = 0; i < drawSteps; i += 1) {
            var t = i / drawSteps;
            var tt = t * t;
            var ttt = tt * t;
            var u = 1 - t;
            var uu = u * u;
            var uuu = uu * u;
            var x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;
            var y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;
            var width = Math.min(curve.startWidth + ttt * widthDelta, pen._maxWidth);
            this._drawCurveSegment(x, y, width);
        }
        ctx.closePath();
        ctx.fill();
    },
    _lineTo: function (x, y) {
        ctx.lineTo(x * dpr, y * dpr);
    },
    _moveTo: function (x, y) {
        ctx.moveTo(x * dpr, y * dpr);
    },
    _reset: function () {
        _lastPoints = [];
        _lastVelocity = 0;
        _lastWidth = (_minWidth + _maxWidth) / 2;
        ctx.fillStyle = pen.color;
    },
    _clear: function () {
        ctx.fillStyle = backgroundColor;
        ctx.clearRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32);
        ctx.fillRect(16, 16, ctx.canvas.width - 32, ctx.canvas.height - 32);
        timeLine = [];
        this._reset();
        _isEmpty = true;
        console.log(_isEmpty);
        console.log(isTouching);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2lnbmF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMkNBQXlDO0FBQ3pDLHlDQUFtRDtBQUNuRCwrQ0FBNkM7QUFTN0MsSUFBSSxHQUFHLEdBQVEsSUFBSSxDQUFBO0FBRW5CLElBQUksVUFBVSxHQUFZLEtBQUssQ0FBQTtBQUMvQixJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUE7QUFDN0IsSUFBSSxXQUFXLEdBQVcsQ0FBQyxDQUFBO0FBQzNCLElBQUksZUFBZSxHQUFHLFNBQVMsQ0FBQTtBQUMvQixJQUFJLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUE7QUFDdkQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFBO0FBRVgsSUFBSSxTQUFTLEdBQVcsR0FBRyxDQUFBO0FBQzNCLElBQUksU0FBUyxHQUFXLEdBQUcsQ0FBQTtBQUMzQixJQUFJLFFBQVEsR0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7QUFFbEQsSUFBSSxXQUFXLEdBQVksRUFBRSxDQUFBO0FBQzdCLElBQUksb0JBQW9CLEdBQVcsR0FBRyxDQUFBO0FBQ3RDLElBQUksYUFBYSxHQUFXLENBQUMsQ0FBQTtBQUM3QixJQUFJLFVBQVUsR0FBVyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDcEQsSUFBSSxpQkFBaUIsR0FBUSxJQUFJLENBQUE7QUFHakMsSUFBSSxRQUFRLEdBQWlCLEVBQUUsQ0FBQTtBQUUvQixJQUFJLENBQUM7SUFLSCxJQUFJLEVBQUUsRUFFTDtJQUtELE1BQU0sRUFBRSxVQUFVLE9BQU87UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUtELE9BQU8sRUFBRTtR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R0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFRCxNQUFNLEVBQU47UUFDRSxXQUFXLEdBQUcsRUFBRSxDQUFBO1FBQ2hCLGFBQWEsR0FBRyxDQUFDLENBQUE7UUFDakIsVUFBVSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN4QyxHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFDM0IsQ0FBQztJQUVELE1BQU0sRUFBTjtRQUNFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUE7UUFDcEUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUNuRSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1FBQ2IsUUFBUSxHQUFHLElBQUksQ0FBQTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN6QixDQUFDO0NBRUYsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbWluaXByb2dyYW0vcGFnZXMvc2lnbmF0dXJlLmpzXG5pbXBvcnQgeyBCZXppZXIgfSBmcm9tICcuLi8uLi9saWIvYmV6aWVyJ1xuaW1wb3J0IHsgQmFzaWNQb2ludCwgUG9pbnQgfSBmcm9tICcuLi8uLi9saWIvcG9pbnQnXG5pbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4uLy4uL2xpYi90aHJvdHRsZSdcblxuXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50R3JvdXAge1xuICBjb2xvcjogc3RyaW5nO1xuICBwb2ludHM6IEJhc2ljUG9pbnRbXTtcbn1cblxuLy8gY2FudmFzIGNvbnRleHRcbmxldCBjdHg6IGFueSA9IG51bGxcbi8vIHRvdWNoIGRyYXdpbmdcbmxldCBpc1RvdWNoaW5nOiBib29sZWFuID0gZmFsc2VcbmxldCBfaXNFbXB0eTogYm9vbGVhbiA9IGZhbHNlXG5sZXQgbWluRGlzdGFuY2U6IG51bWJlciA9IDVcbmxldCBiYWNrZ3JvdW5kQ29sb3IgPSAnIzRmNzM2ZCdcbmxldCBwZW4gPSB7IGNvbG9yOiAnIzMzMzMzMycsIHdpZHRoOiAxLCBfbWF4V2lkdGg6IDEwIH1cbmxldCBkcHIgPSAxXG5cbmxldCBfbWF4V2lkdGg6IG51bWJlciA9IDIuNVxubGV0IF9taW5XaWR0aDogbnVtYmVyID0gMC41XG5sZXQgX2RvdFNpemU6IG51bWJlciA9IChfbWluV2lkdGggKyBfbWF4V2lkdGgpIC8gMlxuXG5sZXQgX2xhc3RQb2ludHM6IFBvaW50W10gPSBbXVxubGV0IHZlbG9jaXR5RmlsdGVyV2VpZ2h0OiBudW1iZXIgPSAwLjdcbmxldCBfbGFzdFZlbG9jaXR5OiBudW1iZXIgPSAwXG5sZXQgX2xhc3RXaWR0aDogbnVtYmVyID0gKF9taW5XaWR0aCArIF9tYXhXaWR0aCkgLyAyXG5sZXQgX3N0cm9rZU1vdmVVcGRhdGU6IGFueSA9IG51bGxcblxuLy8g5pe26Ze06L2077yM6K6w5b2V5pON5L2c5q2l6aqk5pWw5o2uXG5sZXQgdGltZUxpbmU6IFBvaW50R3JvdXBbXSA9IFtdXG5cblBhZ2Uoe1xuXG4gIC8qKlxuICAgKiBQYWdlIGluaXRpYWwgZGF0YVxuICAgKi9cbiAgZGF0YToge1xuXG4gIH0sXG5cbiAgLyoqXG4gICAqIExpZmVjeWNsZSBmdW5jdGlvbi0tQ2FsbGVkIHdoZW4gcGFnZSBsb2FkXG4gICAqL1xuICBvbkxvYWQ6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2coJ29uTG9hZCcsIG9wdGlvbnMpXG4gIH0sXG5cbiAgLyoqXG4gICAqIExpZmVjeWNsZSBmdW5jdGlvbi0tQ2FsbGVkIHdoZW4gcGFnZSBpcyBpbml0aWFsbHkgcmVuZGVyZWRcbiAgICovXG4gIG9uUmVhZHk6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmluaXRDb250ZXh0KClcbiAgICBfc3Ryb2tlTW92ZVVwZGF0ZSA9IHRocm90dGxlKHRoaXMuX3N0cm9rZVVwZGF0ZSwgMTYpXG4gIH0sXG5cbiAgLyoqXG4gICAqIExpZmVjeWNsZSBmdW5jdGlvbi0tQ2FsbGVkIHdoZW4gcGFnZSBzaG93XG4gICAqL1xuICBvblNob3c6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG4gIC8qKlxuICAgKiBMaWZlY3ljbGUgZnVuY3Rpb24tLUNhbGxlZCB3aGVuIHBhZ2UgaGlkZVxuICAgKi9cbiAgb25IaWRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICAvKipcbiAgICogTGlmZWN5Y2xlIGZ1bmN0aW9uLS1DYWxsZWQgd2hlbiBwYWdlIHVubG9hZFxuICAgKi9cbiAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG4gIC8qKlxuICAgKiBpbml0IGNhbnZhcyBjb250ZXh0XG4gICAqL1xuICBpbml0Q29udGV4dCAoKSB7XG4gICAgY29uc3QgeyBwaXhlbFJhdGlvLCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0IH0gPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpXG4gICAgZHByID0gcGl4ZWxSYXRpb1xuICAgIGNvbnNvbGUubG9nKCdwaXhlbFJhdGlvJywgcGl4ZWxSYXRpbylcblxuICAgIGNvbnN0IHF1ZXJ5ID0gd3guY3JlYXRlU2VsZWN0b3JRdWVyeSgpXG4gICAgcXVlcnkuc2VsZWN0KCcjY2FudmFzJykubm9kZSgpLmV4ZWMoKHJlczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IGNhbnZhcyA9IHJlc1swXS5ub2RlXG4gICAgICBjb25zb2xlLmxvZygnY2FudmFzIC0tLSAnLCBjYW52YXMpXG4gICAgICAvLyBjYW52YXMud2lkdGggPSB3aW5kb3dXaWR0aCAqIGRwclxuICAgICAgLy8gY2FudmFzLmhlaWdodCA9IHdpbmRvd0hlaWdodCAqIGRwclxuICAgICAgY2FudmFzLndpZHRoID0gd2luZG93V2lkdGhcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3dIZWlnaHRcblxuICAgICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgIC8vIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKVxuICAgICAgY29uc29sZS5sb2coJ2N0eCcsIGN0eClcblxuICAgICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxuICAgICAgY3R4LmZpbGxSZWN0KDE2LCAxNiwgY3R4LmNhbnZhcy53aWR0aCAtIDMyLCBjdHguY2FudmFzLmhlaWdodCAtIDMyKVxuICAgIH0pXG4gIH0sXG5cbiAgb25Ub3VjaFN0YXJ0IChldmVudDogYW55KSA6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCd0b3VjaCBzdGFydCAtLSAnLCBldmVudClcbiAgICBpc1RvdWNoaW5nID0gdHJ1ZVxuICAgIHRoaXMuX3N0cm9rZUJlZ2luKGV2ZW50KVxuICB9LFxuXG4gIG9uVG91Y2hNb3ZlIChldmVudDogYW55KSA6IHZvaWQge1xuICAgIC8vIGNvbnNvbGUubG9nKCd0b3VjaCBtb3ZlIC0tJywgZXZlbnQpXG4gICAgX3N0cm9rZU1vdmVVcGRhdGUoZXZlbnQpXG4gIH0sXG5cbiAgb25Ub3VjaEVuZCAoZXZlbnQ6IGFueSkgOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZygndG91Y2ggZW5kIC0tJywgZXZlbnQpXG4gICAgaXNUb3VjaGluZyA9IGZhbHNlXG4gICAgdGhpcy5fc3Ryb2tlRW5kKGV2ZW50KVxuICB9LFxuXG4gIG9uVG91Y2hDYW5jZWwgKGV2ZW50OiBhbnkpIDogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ3RvdWNoIGNhbmNlbCcsIGV2ZW50KVxuICAgIGlzVG91Y2hpbmcgPSBmYWxzZVxuICAgIHRoaXMuX3N0cm9rZUVuZChldmVudClcbiAgfSxcblxuICBvbkVycm9yIChldmVudDogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ2NhbnZhcyBlcnJvcicsIGV2ZW50KVxuICAgIGlzVG91Y2hpbmcgPSBmYWxzZVxuICAgIHRoaXMuX3N0cm9rZUVuZChldmVudClcbiAgfSxcblxuICBfc3Ryb2tlQmVnaW4gKGV2ZW50PzogYW55KSA6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdfc3Ryb2tlQmVnaW4gKysrKysrKysnKVxuICAgIGNvbnN0IG5ld1BvaW50R3JvdXAgPSB7XG4gICAgICBjb2xvcjogcGVuLmNvbG9yLFxuICAgICAgcG9pbnRzOiBbXSxcbiAgICB9O1xuICAgIHRpbWVMaW5lLnB1c2gobmV3UG9pbnRHcm91cCk7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICBfc3Ryb2tlTW92ZVVwZGF0ZShldmVudClcbiAgfSxcblxuICBfc3Ryb2tlVXBkYXRlIChldmVudDogYW55KSA6IHZvaWQge1xuICAgIGlmICh0aW1lTGluZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuX3N0cm9rZUJlZ2luKGV2ZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHt4LCB5fSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdXG4gICAgY29uc3QgcG9pbnQgPSB0aGlzLl9jcmVhdGVQb2ludCh4LCB5KVxuICAgIGNvbnN0IGxhc3RQb2ludEdyb3VwID0gdGltZUxpbmVbdGltZUxpbmUubGVuZ3RoIC0gMV1cbiAgICBjb25zdCBsYXN0UG9pbnRzID0gbGFzdFBvaW50R3JvdXAucG9pbnRzXG4gICAgY29uc3QgbGFzdFBvaW50ID0gbGFzdFBvaW50cy5sZW5ndGggPiAwICYmIGxhc3RQb2ludHNbbGFzdFBvaW50cy5sZW5ndGggLSAxXVxuICAgIGNvbnN0IGlzTGFzdFBvaW50VG9vQ2xvc2UgPSBsYXN0UG9pbnQgPyBwb2ludC5kaXN0YW5jZVRvKGxhc3RQb2ludCkgPD0gbWluRGlzdGFuY2UgOiBmYWxzZVxuICAgIHBlbi5jb2xvciA9IGxhc3RQb2ludEdyb3VwLmNvbG9yXG4gICAgaWYgKCFsYXN0UG9pbnQgfHwgIShsYXN0UG9pbnQgJiYgaXNMYXN0UG9pbnRUb29DbG9zZSkpIHtcbiAgICAgIGNvbnN0IGN1cnZlID0gdGhpcy5fYWRkUG9pbnQocG9pbnQpXG4gICAgICBpZiAoIWxhc3RQb2ludHMpIHtcbiAgICAgICAgdGhpcy5fZHJhd0RvdChwb2ludClcbiAgICAgIH0gZWxzZSBpZiAoY3VydmUpIHtcbiAgICAgICAgdGhpcy5fZHJhd0N1cnZlKGN1cnZlKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfc3Ryb2tlRW5kIChldmVudDogYW55KSA6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKCdlbmQgKysrKysrKyAnLCBldmVudClcbiAgICBfc3Ryb2tlTW92ZVVwZGF0ZShldmVudClcbiAgfSxcblxuICBfY2FsY3VsYXRlQ3VydmVXaWR0aHMgKHN0YXJ0UG9pbnQ6IFBvaW50LCBlbmRQb2ludDogUG9pbnQpIDogeyBzdGFydDogbnVtYmVyOyBlbmQ6IG51bWJlciB9IHtcbiAgICBjb25zdCB2ZWxvY2l0eSA9IHZlbG9jaXR5RmlsdGVyV2VpZ2h0ICogZW5kUG9pbnQudmVsb2NpdHlGcm9tKHN0YXJ0UG9pbnQpICsgKDEgLSB2ZWxvY2l0eUZpbHRlcldlaWdodCkgKiBfbGFzdFZlbG9jaXR5XG4gICAgY29uc3QgbmV3V2lkdGggPSB0aGlzLl9zdHJva2VXaWR0aCh2ZWxvY2l0eSlcbiAgICBjb25zdCB3aWR0aHMgPSB7XG4gICAgICBzdGFydDogX2xhc3RXaWR0aCxcbiAgICAgIGVuZDogbmV3V2lkdGgsXG4gICAgfVxuICAgIF9sYXN0VmVsb2NpdHkgPSB2ZWxvY2l0eVxuICAgIF9sYXN0V2lkdGggPSBuZXdXaWR0aFxuICAgIHJldHVybiB3aWR0aHNcbiAgfSxcblxuICBfc3Ryb2tlV2lkdGggKHZlbG9jaXR5OiBudW1iZXIpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoX21heFdpZHRoIC8gKHZlbG9jaXR5ICsgMSksIF9taW5XaWR0aCk7XG4gIH0sXG5cbiAgX2NyZWF0ZVBvaW50KHg6IG51bWJlciwgeTogbnVtYmVyKTogUG9pbnQge1xuICAgIC8vIGNvbnN0IHtsZWZ0LCB0b3B9ID0gY3R4LmNhbnZhcztcbiAgICBjb25zdCBsZWZ0ID0gMDtcbiAgICBjb25zdCB0b3AgPSAwO1xuICAgIHJldHVybiBuZXcgUG9pbnQoeCAtIGxlZnQsIHkgLSB0b3AsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgfSxcblxuICBfYWRkUG9pbnQocG9pbnQ6IFBvaW50KSA6IEJlemllciB8IG51bGwge1xuICAgIGlmICh0aW1lTGluZS5sZW5ndGggPiAxKSB7XG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLSB0aW1lTGluZSAtLS0tLS0nKVxuICAgICAgdGltZUxpbmVbdGltZUxpbmUubGVuZ3RoIC0gMV0ucG9pbnRzLnB1c2gocG9pbnQpXG4gICAgfVxuICAgIF9sYXN0UG9pbnRzLnB1c2gocG9pbnQpO1xuICAgIGlmIChfbGFzdFBvaW50cy5sZW5ndGggPiAyKSB7XG4gICAgICAvLyBUbyByZWR1Y2UgdGhlIGluaXRpYWwgbGFnIG1ha2UgaXQgd29yayB3aXRoIDMgcG9pbnRzXG4gICAgICAvLyBieSBjb3B5aW5nIHRoZSBmaXJzdCBwb2ludCB0byB0aGUgYmVnaW5uaW5nLlxuICAgICAgaWYgKF9sYXN0UG9pbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBfbGFzdFBvaW50cy51bnNoaWZ0KF9sYXN0UG9pbnRzWzBdKTtcbiAgICAgIH1cblxuICAgICAgLy8gX3BvaW50cyBhcnJheSB3aWxsIGFsd2F5cyBoYXZlIDQgcG9pbnRzIGhlcmUuXG4gICAgICBjb25zdCB3aWR0aHMgPSB0aGlzLl9jYWxjdWxhdGVDdXJ2ZVdpZHRocyhfbGFzdFBvaW50c1sxXSwgX2xhc3RQb2ludHNbMl0pO1xuICAgICAgY29uc3QgY3VydmUgPSBCZXppZXIuZnJvbVBvaW50cyhfbGFzdFBvaW50cywgd2lkdGhzKTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gdGhlIGxpc3QsIHNvIHRoYXQgdGhlcmUgYXJlIG5vIG1vcmUgdGhhbiA0IHBvaW50cyBhdCBhbnkgdGltZS5cbiAgICAgIF9sYXN0UG9pbnRzLnNoaWZ0KCk7XG5cbiAgICAgIHJldHVybiBjdXJ2ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBfZHJhd0RvdCAocG9pbnQ6IEJhc2ljUG9pbnQpIDogdm9pZCB7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGNvbnN0IHdpZHRoID0gX2RvdFNpemVcbiAgICB0aGlzLl9kcmF3Q3VydmVTZWdtZW50KHBvaW50LngsIHBvaW50LnksIHdpZHRoKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHBlbi5jb2xvcjtcbiAgICBjdHguZmlsbCgpO1xuICB9LFxuXG4gIF9kcmF3Q3VydmVTZWdtZW50ICh4OiBudW1iZXIsIHk6bnVtYmVyLCB3aWR0aDogbnVtYmVyKSB7XG4gICAgY3R4Lm1vdmVUbyh4LCB5KVxuICAgIGN0eC5hcmMoeCwgeSwgd2lkdGgsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSlcbiAgICBfaXNFbXB0eSA9IGZhbHNlXG4gIH0sXG5cbiAgX2RyYXdDdXJ2ZShjdXJ2ZTogQmV6aWVyKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coJ19kcmF3Q3VydmUgLS0tLSAnLCBjdXJ2ZSlcbiAgICBjb25zdCB3aWR0aERlbHRhID0gY3VydmUuZW5kV2lkdGggLSBjdXJ2ZS5zdGFydFdpZHRoXG4gICAgLy8gJzInIGlzIGp1c3QgYW4gYXJiaXRyYXJ5IG51bWJlciBoZXJlLiBJZiBvbmx5IGxlbmdodCBpcyB1c2VkLCB0aGVuXG4gICAgLy8gdGhlcmUgYXJlIGdhcHMgYmV0d2VlbiBjdXJ2ZSBzZWdtZW50cyA6L1xuICAgIGNvbnN0IGRyYXdTdGVwcyA9IE1hdGguZmxvb3IoY3VydmUubGVuZ3RoKCkpICogMlxuXG4gICAgY3R4LmJlZ2luUGF0aCgpXG4gICAgY3R4LmZpbGxTdHlsZSA9IHBlbi5jb2xvclxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkcmF3U3RlcHM7IGkgKz0gMSkge1xuICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBCZXppZXIgKHgsIHkpIGNvb3JkaW5hdGUgZm9yIHRoaXMgc3RlcC5cbiAgICAgIGNvbnN0IHQgPSBpIC8gZHJhd1N0ZXBzXG4gICAgICBjb25zdCB0dCA9IHQgKiB0XG4gICAgICBjb25zdCB0dHQgPSB0dCAqIHRcbiAgICAgIGNvbnN0IHUgPSAxIC0gdFxuICAgICAgY29uc3QgdXUgPSB1ICogdVxuICAgICAgY29uc3QgdXV1ID0gdXUgKiB1XG5cbiAgICAgIGxldCB4ID0gdXV1ICogY3VydmUuc3RhcnRQb2ludC54XG4gICAgICB4ICs9IDMgKiB1dSAqIHQgKiBjdXJ2ZS5jb250cm9sMS54XG4gICAgICB4ICs9IDMgKiB1ICogdHQgKiBjdXJ2ZS5jb250cm9sMi54XG4gICAgICB4ICs9IHR0dCAqIGN1cnZlLmVuZFBvaW50LnhcblxuICAgICAgbGV0IHkgPSB1dXUgKiBjdXJ2ZS5zdGFydFBvaW50LnlcbiAgICAgIHkgKz0gMyAqIHV1ICogdCAqIGN1cnZlLmNvbnRyb2wxLnlcbiAgICAgIHkgKz0gMyAqIHUgKiB0dCAqIGN1cnZlLmNvbnRyb2wyLnlcbiAgICAgIHkgKz0gdHR0ICogY3VydmUuZW5kUG9pbnQueVxuXG4gICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWluKFxuICAgICAgICBjdXJ2ZS5zdGFydFdpZHRoICsgdHR0ICogd2lkdGhEZWx0YSxcbiAgICAgICAgcGVuLl9tYXhXaWR0aCxcbiAgICAgICk7XG4gICAgICB0aGlzLl9kcmF3Q3VydmVTZWdtZW50KHgsIHksIHdpZHRoKTtcbiAgICB9XG5cbiAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgY3R4LmZpbGwoKTtcbiAgfSxcblxuICBfbGluZVRvICh4OiBudW1iZXIsIHk6IG51bWJlcikgOiB2b2lkIHtcbiAgICBjdHgubGluZVRvKHggKiBkcHIsIHkgKiBkcHIpXG4gIH0sXG5cbiAgX21vdmVUbyAoeDogbnVtYmVyLCB5OiBudW1iZXIpIDogdm9pZCB7XG4gICAgY3R4Lm1vdmVUbyh4ICogZHByLCB5ICogZHByKVxuICB9LFxuXG4gIF9yZXNldCAoKSA6IHZvaWQge1xuICAgIF9sYXN0UG9pbnRzID0gW11cbiAgICBfbGFzdFZlbG9jaXR5ID0gMFxuICAgIF9sYXN0V2lkdGggPSAoX21pbldpZHRoICsgX21heFdpZHRoKSAvIDJcbiAgICBjdHguZmlsbFN0eWxlID0gcGVuLmNvbG9yXG4gIH0sXG5cbiAgX2NsZWFyICgpIDogdm9pZCB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvcjtcbiAgICBjdHguY2xlYXJSZWN0KDE2LCAxNiwgY3R4LmNhbnZhcy53aWR0aCAtIDMyLCBjdHguY2FudmFzLmhlaWdodCAtIDMyKVxuICAgIGN0eC5maWxsUmVjdCgxNiwgMTYsIGN0eC5jYW52YXMud2lkdGggLSAzMiwgY3R4LmNhbnZhcy5oZWlnaHQgLSAzMilcbiAgICB0aW1lTGluZSA9IFtdXG4gICAgdGhpcy5fcmVzZXQoKVxuICAgIF9pc0VtcHR5ID0gdHJ1ZVxuICAgIGNvbnNvbGUubG9nKF9pc0VtcHR5KVxuICAgIGNvbnNvbGUubG9nKGlzVG91Y2hpbmcpXG4gIH0sXG5cbn0pIl19