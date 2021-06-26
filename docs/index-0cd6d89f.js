function t(t,e,n){const r=Reflect.ownKeys(e),u=class{static get inputProperties(){return r}};u.prototype.paint=n,registerPaint(t,u);}Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",get_current_path:function(t){return t.substring(0,t.lastIndexOf("/"))},get_text:async function(t){return await fetch(t).then((t=>t.text()))}});var n=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",get_values:function(t){return Object.keys(t).map((e=>t[e]))}});const r={is_style_value:!0},u={is_unit_value:!0},o={is_keyword_value:!0};function s(t){return t}function i(t){Object.keys(t).forEach((e=>{CSS.registerProperty(t[e]);}));}

var TransitionProperties;
(function (TransitionProperties) {
    // 颜色
    TransitionProperties["COLOR"] = "--lilith-transition-color";
    // 过渡长度
    TransitionProperties["LENGHT"] = "--lilith-transition-length";
    // 过渡方向，横向（horizontal）与纵向（vertical）
    TransitionProperties["DIRECTION"] = "--lilith-transition-direction";
    // 图形密度，每图形之间的间隔，该值越大则图形密度越低
    TransitionProperties["DENSITY"] = "--lilith-transition-density";
    // 当前过渡位置
    TransitionProperties["POSITION"] = "--lilith-transition-position";
    // 过渡风格，淡入（fade-in）、淡出（fade-out）、淡入淡出（fade-in-out）
    TransitionProperties["STYLE"] = "--lilith-transition-style";
    // 图形最大值，大于 0 的数值，若未设置或小于等于 0，则跟随图形密度
    TransitionProperties["MAX_SIZE"] = "--lilith-transition-max-size";
})(TransitionProperties || (TransitionProperties = {}));
var TransitionDirection;
(function (TransitionDirection) {
    TransitionDirection["HORIZONTAL"] = "horizontal";
    TransitionDirection["VERTICAL"] = "vertical";
})(TransitionDirection || (TransitionDirection = {}));
var TransitionStyle;
(function (TransitionStyle) {
    TransitionStyle["FADE_IN"] = "fade-in";
    TransitionStyle["FADE_OUT"] = "fade-out";
    TransitionStyle["FADE_IN_OUT"] = "fade-in-out";
})(TransitionStyle || (TransitionStyle = {}));
const lilith_properties = s({
    [TransitionProperties.DIRECTION]: {
        name: TransitionProperties.DIRECTION,
        initialValue: TransitionDirection.HORIZONTAL,
        syntax: n.get_values(TransitionDirection).join(" | "),
        inherits: true,
        ...o,
    },
    [TransitionProperties.COLOR]: {
        name: TransitionProperties.COLOR,
        inherits: true,
        syntax: "<color>",
        initialValue: "#000",
        ...r,
    },
    [TransitionProperties.DENSITY]: {
        name: TransitionProperties.DENSITY,
        inherits: true,
        syntax: "<length> | <length-percentage>",
        initialValue: "100px",
        ...u,
    },
    [TransitionProperties.LENGHT]: {
        name: TransitionProperties.LENGHT,
        initialValue: "200px",
        syntax: "<length> | <length-percentage>",
        inherits: true,
        ...u,
    },
    [TransitionProperties.POSITION]: {
        name: TransitionProperties.POSITION,
        initialValue: "0",
        syntax: "<length> | <length-percentage>",
        inherits: false,
        ...u,
    },
    [TransitionProperties.STYLE]: {
        name: TransitionProperties.STYLE,
        initialValue: TransitionStyle.FADE_IN,
        syntax: n.get_values(TransitionStyle).join(" | "),
        inherits: true,
        ...o,
    },
    [TransitionProperties.MAX_SIZE]: {
        name: TransitionProperties.MAX_SIZE,
        initialValue: "0",
        syntax: "<length> | <length-percentage>",
        inherits: true,
        ...u,
    },
});

try {
    const meta = document.querySelector("meta[name='lilith-debug']");
    let module_url = import.meta.url;
    if (meta && meta.content === "true") {
        module_url += `${module_url.includes("?") ? "&" : "?"}lilith-debug=true`;
    }
    // 注册自定义属性，并添加 worklet 模块。
    i(lilith_properties);
    CSS.paintWorklet.addModule(module_url);
    if (meta && meta.content === "true") {
        console.info("[lilith][transition] properties initialized!");
    }
}
catch (e) {
    // 作为 worklet 模块加载时，初始化相关函数，并注册 paint。
    const debug_mode = import.meta.url.includes("lilith-debug=true");
    /**
     * 将百分比单位转化为像素单位。
     * @param value 值对象
     * @param ref 参照长度，px
     */
    function to_pixel(value, ref) {
        if (value.unit === "px") {
            return value;
        }
        else {
            return new CSSUnitValue((value.value * ref) / 100, "px");
        }
    }
    /**
     * 一次性计算出所有的半径，只需计算一行即可。
     * @param position 当前过渡进度
     * @param length 渐变长度
     * @param total_length 总长，根据 --lilith-transition-direction 不同而不同
     * @param style 渐变风格
     * @param max_size 最大半径
     * @param density 网点间隔
     * @returns
     */
    function calc_all_radius(position, length, total_length, style, max_size, density) {
        const offset = (total_length / 2) % density;
        position += offset;
        const result = new Array(Math.ceil(total_length / density) + 1)
            .fill(0)
            .map((_, index) => {
            const ref = index * density;
            const offset = Math.abs(position - ref);
            return (style === TransitionStyle.FADE_IN && ref <= position) ||
                (style === TransitionStyle.FADE_OUT && ref >= position)
                ? max_size
                : offset >= length
                    ? 0
                    : (1 - offset / length) * max_size;
        });
        return result;
    }
    // 绘制菱形，TODO: 逻辑待优化
    function draw_diamond(ctx, rect) {
        const { width, height } = {
            width: rect.width / 2,
            height: rect.height / 2,
        };
        ctx.beginPath();
        ctx.moveTo(rect.x, rect.y - height);
        ctx.lineTo(rect.x + width, rect.y);
        ctx.lineTo(rect.x, rect.y + height);
        ctx.lineTo(rect.x - width, rect.y);
        ctx.closePath();
        ctx.fill();
    }
    t("lilith-transition", lilith_properties, (ctx, geom, properties) => {
        const direction = properties.get(TransitionProperties.DIRECTION)
            .value;
        const is_horizontal = direction === TransitionDirection.HORIZONTAL;
        const ref = direction === TransitionDirection.HORIZONTAL ? geom.width : geom.height;
        const position = to_pixel(properties.get(TransitionProperties.POSITION), ref).value;
        const length = to_pixel(properties.get(TransitionProperties.LENGHT), ref).value;
        const density = to_pixel(properties.get(TransitionProperties.DENSITY), ref).value;
        const style = properties.get(TransitionProperties.STYLE)
            .value;
        let max_size_value = properties.get(TransitionProperties.MAX_SIZE);
        if (max_size_value.value <= 0) {
            max_size_value = properties.get(TransitionProperties.DENSITY);
        }
        const max_size = to_pixel(max_size_value, ref).value;
        const color = properties.get(TransitionProperties.COLOR).toString();
        const offset = {
            x: (geom.width / 2) % density,
            y: (geom.height / 2) % density,
        };
        const radius = calc_all_radius(position, length, ref, style, max_size, density);
        if (!is_horizontal) {
            ctx.transform(1, 0, 0, 1, geom.width, 0);
            ctx.rotate(Math.PI / 2);
        }
        ctx.fillStyle = color;
        for (let y = -offset.y; y <= geom.height; y += density) {
            radius.forEach((r, i) => {
                if (r) {
                    draw_diamond(ctx, {
                        x: i * density - offset.x,
                        y,
                        width: r * 2,
                        height: r * 2,
                    });
                }
            });
        }
    });
    if (debug_mode) {
        console.info("[lilith][transition] paint initialized!");
    }
}
//# sourceMappingURL=index-0cd6d89f.js.map
