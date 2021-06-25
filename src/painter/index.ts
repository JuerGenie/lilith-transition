import { register, register_properties } from "lilith-painter";
import {
  lilith_properties,
  TransitionDirection,
  TransitionProperties,
  TransitionStyle,
} from "./properties";

try {
  const meta = document.querySelector(
    "meta[name='lilith-debug']"
  ) as HTMLMetaElement;

  let module_url = import.meta.url;
  if (meta.content === "true") {
    module_url += `${module_url.includes("?") ? "&" : "?"}lilith-debug=true`;
  }

  // 注册自定义属性，并添加 worklet 模块。
  register_properties(lilith_properties);
  CSS.paintWorklet.addModule(module_url);

  if (meta && meta.content === "true") {
    console.info("[lilith][transition] properties initialized!");
  }
} catch (e) {
  // 作为 worklet 模块加载时，初始化相关函数，并注册 paint。
  const debug_mode = import.meta.url.includes("lilith-debug=true");

  /**
   * 将百分比单位转化为像素单位。
   * @param value 值对象
   * @param ref 参照长度，px
   */
  function to_pixel(value: CSSUnitValue, ref: number): CSSUnitValue<"px"> {
    if (value.unit === "px") {
      return value as CSSUnitValue<"px">;
    } else {
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
  function calc_all_radius(
    position: number,
    length: number,
    total_length: number,
    style: TransitionStyle,
    max_size: number,
    density: number
  ): number[] {
    const offset = (total_length / 2) % density;
    position += offset;

    const result = new Array<number>(Math.ceil(total_length / density) + 1)
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

  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  // 绘制菱形，TODO: 逻辑待优化
  function draw_diamond(ctx: PaintRenderingContext2D, rect: Rect) {
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

  register("lilith-transition", lilith_properties, (ctx, geom, properties) => {
    const direction = properties.get(TransitionProperties.DIRECTION)
      .value as TransitionDirection;
    const is_horizontal = direction === TransitionDirection.HORIZONTAL;
    const ref =
      direction === TransitionDirection.HORIZONTAL ? geom.width : geom.height;
    const position = to_pixel(
      properties.get(TransitionProperties.POSITION),
      ref
    ).value;
    const length = to_pixel(
      properties.get(TransitionProperties.LENGHT),
      ref
    ).value;
    const density = to_pixel(
      properties.get(TransitionProperties.DENSITY),
      ref
    ).value;
    const style = properties.get(TransitionProperties.STYLE)
      .value as TransitionStyle;

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

    const radius = calc_all_radius(
      position,
      length,
      ref,
      style,
      max_size,
      density
    );
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
