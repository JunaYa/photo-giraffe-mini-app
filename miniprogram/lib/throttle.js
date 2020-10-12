"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throttle(fn, wait) {
    if (wait === void 0) { wait = 250; }
    var previous = 0;
    var timeout = null;
    var result;
    var storedContext;
    var storedArgs;
    var later = function () {
        previous = Date.now();
        timeout = null;
        result = fn.apply(storedContext, storedArgs);
        if (!timeout) {
            storedContext = null;
            storedArgs = [];
        }
    };
    return function wrapper() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        var remaining = wait - (now - previous);
        storedContext = this;
        storedArgs = args;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(storedContext, storedArgs);
            if (!timeout) {
                storedContext = null;
                storedArgs = [];
            }
        }
        else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}
exports.throttle = throttle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0aHJvdHRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLFNBQWdCLFFBQVEsQ0FDdEIsRUFBMkIsRUFDM0IsSUFBVTtJQUFWLHFCQUFBLEVBQUEsVUFBVTtJQUVWLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNqQixJQUFJLE9BQU8sR0FBa0IsSUFBSSxDQUFDO0lBQ2xDLElBQUksTUFBVyxDQUFDO0lBQ2hCLElBQUksYUFBa0IsQ0FBQztJQUN2QixJQUFJLFVBQWlCLENBQUM7SUFFdEIsSUFBTSxLQUFLLEdBQUc7UUFDWixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDZixNQUFNLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDckIsVUFBVSxHQUFHLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUMsQ0FBQztJQUVGLE9BQU8sU0FBUyxPQUFPO1FBQVksY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7UUFDL0MsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUUxQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFbEIsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLFNBQVMsR0FBRyxJQUFJLEVBQUU7WUFDdEMsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QixPQUFPLEdBQUcsSUFBSSxDQUFDO2FBQ2hCO1lBRUQsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUNmLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU3QyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLGFBQWEsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLFVBQVUsR0FBRyxFQUFFLENBQUM7YUFDakI7U0FDRjthQUFNLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbkIsT0FBTyxHQUFHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDeEM7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLENBQUM7QUFDSixDQUFDO0FBL0NELDRCQStDQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbi8vIFNsaWdodGx5IHNpbXBsaWZpZWQgdmVyc2lvbiBvZiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNzA3ODQwMS84MTU1MDdcblxuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKFxuICBmbjogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnksXG4gIHdhaXQgPSAyNTAsXG4pOiAodGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55IHtcbiAgbGV0IHByZXZpb3VzID0gMDtcbiAgbGV0IHRpbWVvdXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBsZXQgcmVzdWx0OiBhbnk7XG4gIGxldCBzdG9yZWRDb250ZXh0OiBhbnk7XG4gIGxldCBzdG9yZWRBcmdzOiBhbnlbXTtcblxuICBjb25zdCBsYXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICBwcmV2aW91cyA9IERhdGUubm93KCk7XG4gICAgdGltZW91dCA9IG51bGw7XG4gICAgcmVzdWx0ID0gZm4uYXBwbHkoc3RvcmVkQ29udGV4dCwgc3RvcmVkQXJncyk7XG5cbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHN0b3JlZENvbnRleHQgPSBudWxsO1xuICAgICAgc3RvcmVkQXJncyA9IFtdO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlcih0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuXG4gICAgc3RvcmVkQ29udGV4dCA9IHRoaXM7XG4gICAgc3RvcmVkQXJncyA9IGFyZ3M7XG5cbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICByZXN1bHQgPSBmbi5hcHBseShzdG9yZWRDb250ZXh0LCBzdG9yZWRBcmdzKTtcblxuICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHN0b3JlZENvbnRleHQgPSBudWxsO1xuICAgICAgICBzdG9yZWRBcmdzID0gW107XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghdGltZW91dCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbiJdfQ==