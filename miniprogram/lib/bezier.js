"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_1 = require("./point");
class Bezier {
    constructor(startPoint, control2, control1, endPoint, startWidth, endWidth) {
        this.startPoint = startPoint;
        this.control2 = control2;
        this.control1 = control1;
        this.endPoint = endPoint;
        this.startWidth = startWidth;
        this.endWidth = endWidth;
    }
    static fromPoints(points, widths) {
        const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
        const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
        return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
    }
    static calculateControlPoints(s1, s2, s3) {
        const dx1 = s1.x - s2.x;
        const dy1 = s1.y - s2.y;
        const dx2 = s2.x - s3.x;
        const dy2 = s2.y - s3.y;
        const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
        const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
        const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm = m1.x - m2.x;
        const dym = m1.y - m2.y;
        const k = l2 / (l1 + l2);
        const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx = s2.x - cm.x;
        const ty = s2.y - cm.y;
        return {
            c1: new point_1.Point(m1.x + tx, m1.y + ty),
            c2: new point_1.Point(m2.x + tx, m2.y + ty),
        };
    }
    length() {
        const steps = 10;
        let length = 0;
        let px;
        let py;
        for (let i = 0; i <= steps; i += 1) {
            const t = i / steps;
            const cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
            const cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
            if (i > 0) {
                const xdiff = cx - px;
                const ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }
        return length;
    }
    point(t, start, c1, c2, end) {
        return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
            + (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
            + (3.0 * c2 * (1.0 - t) * t * t)
            + (end * t * t * t);
    }
}
exports.Bezier = Bezier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmV6aWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmV6aWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTRDO0FBRTVDLE1BQWEsTUFBTTtJQTZDakIsWUFDUyxVQUFpQixFQUNqQixRQUFvQixFQUNwQixRQUFvQixFQUNwQixRQUFlLEVBQ2YsVUFBa0IsRUFDbEIsUUFBZ0I7UUFMaEIsZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFZO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQVk7UUFDcEIsYUFBUSxHQUFSLFFBQVEsQ0FBTztRQUNmLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUN0QixDQUFDO0lBbkRHLE1BQU0sQ0FBQyxVQUFVLENBQ3RCLE1BQWUsRUFDZixNQUFzQztRQUV0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDM0UsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTNFLE9BQU8sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFTyxNQUFNLENBQUMsc0JBQXNCLENBQ25DLEVBQWMsRUFDZCxFQUFjLEVBQ2QsRUFBYztRQUtkLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4QixNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUM5RCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUU5RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFFNUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4QixNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFF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LCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNpY1BvaW50LCBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuXG5leHBvcnQgY2xhc3MgQmV6aWVyIHtcbiAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzKFxuICAgIHBvaW50czogUG9pbnRbXSxcbiAgICB3aWR0aHM6IHsgc3RhcnQ6IG51bWJlcjsgZW5kOiBudW1iZXIgfSxcbiAgKTogQmV6aWVyIHtcbiAgICBjb25zdCBjMiA9IHRoaXMuY2FsY3VsYXRlQ29udHJvbFBvaW50cyhwb2ludHNbMF0sIHBvaW50c1sxXSwgcG9pbnRzWzJdKS5jMjtcbiAgICBjb25zdCBjMyA9IHRoaXMuY2FsY3VsYXRlQ29udHJvbFBvaW50cyhwb2ludHNbMV0sIHBvaW50c1syXSwgcG9pbnRzWzNdKS5jMTtcblxuICAgIHJldHVybiBuZXcgQmV6aWVyKHBvaW50c1sxXSwgYzIsIGMzLCBwb2ludHNbMl0sIHdpZHRocy5zdGFydCwgd2lkdGhzLmVuZCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVDb250cm9sUG9pbnRzKFxuICAgIHMxOiBCYXNpY1BvaW50LFxuICAgIHMyOiBCYXNpY1BvaW50LFxuICAgIHMzOiBCYXNpY1BvaW50LFxuICApOiB7XG4gICAgYzE6IEJhc2ljUG9pbnQ7XG4gICAgYzI6IEJhc2ljUG9pbnQ7XG4gIH0ge1xuICAgIGNvbnN0IGR4MSA9IHMxLnggLSBzMi54O1xuICAgIGNvbnN0IGR5MSA9IHMxLnkgLSBzMi55O1xuICAgIGNvbnN0IGR4MiA9IHMyLnggLSBzMy54O1xuICAgIGNvbnN0IGR5MiA9IHMyLnkgLSBzMy55O1xuXG4gICAgY29uc3QgbTEgPSB7IHg6IChzMS54ICsgczIueCkgLyAyLjAsIHk6IChzMS55ICsgczIueSkgLyAyLjAgfTtcbiAgICBjb25zdCBtMiA9IHsgeDogKHMyLnggKyBzMy54KSAvIDIuMCwgeTogKHMyLnkgKyBzMy55KSAvIDIuMCB9O1xuXG4gICAgY29uc3QgbDEgPSBNYXRoLnNxcnQoZHgxICogZHgxICsgZHkxICogZHkxKTtcbiAgICBjb25zdCBsMiA9IE1hdGguc3FydChkeDIgKiBkeDIgKyBkeTIgKiBkeTIpO1xuXG4gICAgY29uc3QgZHhtID0gbTEueCAtIG0yLng7XG4gICAgY29uc3QgZHltID0gbTEueSAtIG0yLnk7XG5cbiAgICBjb25zdCBrID0gbDIgLyAobDEgKyBsMik7XG4gICAgY29uc3QgY20gPSB7IHg6IG0yLnggKyBkeG0gKiBrLCB5OiBtMi55ICsgZHltICogayB9O1xuXG4gICAgY29uc3QgdHggPSBzMi54IC0gY20ueDtcbiAgICBjb25zdCB0eSA9IHMyLnkgLSBjbS55O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGMxOiBuZXcgUG9pbnQobTEueCArIHR4LCBtMS55ICsgdHkpLFxuICAgICAgYzI6IG5ldyBQb2ludChtMi54ICsgdHgsIG0yLnkgKyB0eSksXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzdGFydFBvaW50OiBQb2ludCxcbiAgICBwdWJsaWMgY29udHJvbDI6IEJhc2ljUG9pbnQsXG4gICAgcHVibGljIGNvbnRyb2wxOiBCYXNpY1BvaW50LFxuICAgIHB1YmxpYyBlbmRQb2ludDogUG9pbnQsXG4gICAgcHVibGljIHN0YXJ0V2lkdGg6IG51bWJlcixcbiAgICBwdWJsaWMgZW5kV2lkdGg6IG51bWJlcixcbiAgKSB7fVxuXG4gIC8vIFJldHVybnMgYXBwcm94aW1hdGVkIGxlbmd0aC4gQ29kZSB0YWtlbiBmcm9tIGh0dHBzOi8vd3d3LmxlbW9kYS5uZXQvbWF0aHMvYmV6aWVyLWxlbmd0aC9pbmRleC5odG1sLlxuICBwdWJsaWMgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgY29uc3Qgc3RlcHMgPSAxMDtcbiAgICBsZXQgbGVuZ3RoID0gMDtcbiAgICBsZXQgcHg7XG4gICAgbGV0IHB5O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc3RlcHM7IGkgKz0gMSkge1xuICAgICAgY29uc3QgdCA9IGkgLyBzdGVwcztcbiAgICAgIGNvbnN0IGN4ID0gdGhpcy5wb2ludChcbiAgICAgICAgdCxcbiAgICAgICAgdGhpcy5zdGFydFBvaW50LngsXG4gICAgICAgIHRoaXMuY29udHJvbDEueCxcbiAgICAgICAgdGhpcy5jb250cm9sMi54LFxuICAgICAgICB0aGlzLmVuZFBvaW50LngsXG4gICAgICApO1xuICAgICAgY29uc3QgY3kgPSB0aGlzLnBvaW50KFxuICAgICAgICB0LFxuICAgICAgICB0aGlzLnN0YXJ0UG9pbnQueSxcbiAgICAgICAgdGhpcy5jb250cm9sMS55LFxuICAgICAgICB0aGlzLmNvbnRyb2wyLnksXG4gICAgICAgIHRoaXMuZW5kUG9pbnQueSxcbiAgICAgICk7XG5cbiAgICAgIGlmIChpID4gMCkge1xuICAgICAgICBjb25zdCB4ZGlmZiA9IGN4IC0gKHB4IGFzIG51bWJlcik7XG4gICAgICAgIGNvbnN0IHlkaWZmID0gY3kgLSAocHkgYXMgbnVtYmVyKTtcblxuICAgICAgICBsZW5ndGggKz0gTWF0aC5zcXJ0KHhkaWZmICogeGRpZmYgKyB5ZGlmZiAqIHlkaWZmKTtcbiAgICAgIH1cblxuICAgICAgcHggPSBjeDtcbiAgICAgIHB5ID0gY3k7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfVxuXG4gIC8vIENhbGN1bGF0ZSBwYXJhbWV0cmljIHZhbHVlIG9mIHggb3IgeSBnaXZlbiB0IGFuZCB0aGUgZm91ciBwb2ludCBjb29yZGluYXRlcyBvZiBhIGN1YmljIGJlemllciBjdXJ2ZS5cbiAgcHJpdmF0ZSBwb2ludChcbiAgICB0OiBudW1iZXIsXG4gICAgc3RhcnQ6IG51bWJlcixcbiAgICBjMTogbnVtYmVyLFxuICAgIGMyOiBudW1iZXIsXG4gICAgZW5kOiBudW1iZXIsXG4gICk6IG51bWJlciB7XG4gICAgLy8gcHJldHRpZXItaWdub3JlXG4gICAgcmV0dXJuICggICAgICAgc3RhcnQgKiAoMS4wIC0gdCkgKiAoMS4wIC0gdCkgICogKDEuMCAtIHQpKVxuICAgICAgICAgKyAoMy4wICogIGMxICAgICogKDEuMCAtIHQpICogKDEuMCAtIHQpICAqIHQpXG4gICAgICAgICArICgzLjAgKiAgYzIgICAgKiAoMS4wIC0gdCkgKiB0ICAgICAgICAgICogdClcbiAgICAgICAgICsgKCAgICAgICBlbmQgICAqIHQgICAgICAgICAqIHQgICAgICAgICAgKiB0KTtcbiAgfVxufVxuIl19