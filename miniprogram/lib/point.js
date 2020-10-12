"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time || Date.now();
    }
    Point.prototype.distanceTo = function (start) {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    };
    Point.prototype.equals = function (other) {
        return this.x === other.x && this.y === other.y && this.time === other.time;
    };
    Point.prototype.velocityFrom = function (start) {
        return this.time !== start.time
            ? this.distanceTo(start) / (this.time - start.time)
            : 0;
    };
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BO0lBR0UsZUFBbUIsQ0FBUyxFQUFTLENBQVMsRUFBRSxJQUFhO1FBQTFDLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRU0sMEJBQVUsR0FBakIsVUFBa0IsS0FBaUI7UUFDakMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUM5RCxDQUFDO0lBQ0osQ0FBQztJQUVNLHNCQUFNLEdBQWIsVUFBYyxLQUFpQjtRQUM3QixPQUFPLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQzlFLENBQUM7SUFFTSw0QkFBWSxHQUFuQixVQUFvQixLQUFpQjtRQUNuQyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUk7WUFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDbkQsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxBQXRCRCxJQXNCQztBQXRCWSxzQkFBSyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEludGVyZmFjZSBmb3IgcG9pbnQgZGF0YSBzdHJ1Y3R1cmUgdXNlZCBlLmcuIGluIFNpZ25hdHVyZVBhZCNmcm9tRGF0YSBtZXRob2RcbmV4cG9ydCBpbnRlcmZhY2UgQmFzaWNQb2ludCB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB0aW1lOiBudW1iZXI7XG59XG4gIFxuZXhwb3J0IGNsYXNzIFBvaW50IGltcGxlbWVudHMgQmFzaWNQb2ludCB7XG4gIHB1YmxpYyB0aW1lOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlciwgdGltZT86IG51bWJlcikge1xuICAgIHRoaXMudGltZSA9IHRpbWUgfHwgRGF0ZS5ub3coKTtcbiAgfVxuXG4gIHB1YmxpYyBkaXN0YW5jZVRvKHN0YXJ0OiBCYXNpY1BvaW50KTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KFxuICAgICAgTWF0aC5wb3codGhpcy54IC0gc3RhcnQueCwgMikgKyBNYXRoLnBvdyh0aGlzLnkgLSBzdGFydC55LCAyKSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGVxdWFscyhvdGhlcjogQmFzaWNQb2ludCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55ICYmIHRoaXMudGltZSA9PT0gb3RoZXIudGltZTtcbiAgfVxuXG4gIHB1YmxpYyB2ZWxvY2l0eUZyb20oc3RhcnQ6IEJhc2ljUG9pbnQpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnRpbWUgIT09IHN0YXJ0LnRpbWVcbiAgICAgID8gdGhpcy5kaXN0YW5jZVRvKHN0YXJ0KSAvICh0aGlzLnRpbWUgLSBzdGFydC50aW1lKVxuICAgICAgOiAwO1xuICB9XG59XG4gICJdfQ==