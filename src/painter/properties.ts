import {
  define_properties,
  enum_utils,
  IsKeywordValue,
  IsStyleValue,
  IsUnitValue,
} from "lilith-painter";

export enum TransitionProperties {
  // 颜色
  COLOR = "--lilith-transition-color",
  // 过渡长度
  LENGHT = "--lilith-transition-length",
  // 过渡方向，横向（horizontal）与纵向（vertical）
  DIRECTION = "--lilith-transition-direction",
  // 图形密度，每图形之间的间隔，该值越大则图形密度越低
  DENSITY = "--lilith-transition-density",
  // 当前过渡位置
  POSITION = "--lilith-transition-position",
  // 过渡风格，淡入（fade-in）、淡出（fade-out）、淡入淡出（fade-in-out）
  STYLE = "--lilith-transition-style",
  // 图形最大值，大于 0 的数值，若未设置或小于等于 0，则跟随图形密度
  MAX_SIZE = "--lilith-transition-max-size",
}

export enum TransitionDirection {
  HORIZONTAL = "horizontal",
  VERTICAL = "vertical",
}

export enum TransitionStyle {
  FADE_IN = "fade-in",
  FADE_OUT = "fade-out",
  FADE_IN_OUT = "fade-in-out",
}

export const lilith_properties = define_properties({
  [TransitionProperties.DIRECTION]: {
    name: TransitionProperties.DIRECTION,
    initialValue: TransitionDirection.HORIZONTAL,
    syntax: enum_utils.get_values(TransitionDirection).join(" | "),
    inherits: true,
    ...IsKeywordValue,
  },
  [TransitionProperties.COLOR]: {
    name: TransitionProperties.COLOR,
    inherits: true,
    syntax: "<color>",
    initialValue: "#000",
    ...IsStyleValue,
  },
  [TransitionProperties.DENSITY]: {
    name: TransitionProperties.DENSITY,
    inherits: true,
    syntax: "<length> | <length-percentage>",
    initialValue: "100px",
    ...IsUnitValue,
  },
  [TransitionProperties.LENGHT]: {
    name: TransitionProperties.LENGHT,
    initialValue: "200px",
    syntax: "<length> | <length-percentage>",
    inherits: true,
    ...IsUnitValue,
  },
  [TransitionProperties.POSITION]: {
    name: TransitionProperties.POSITION,
    initialValue: "0",
    syntax: "<length> | <length-percentage>",
    inherits: false,
    ...IsUnitValue,
  },
  [TransitionProperties.STYLE]: {
    name: TransitionProperties.STYLE,
    initialValue: TransitionStyle.FADE_IN,
    syntax: enum_utils.get_values(TransitionStyle).join(" | "),
    inherits: true,
    ...IsKeywordValue,
  },
  [TransitionProperties.MAX_SIZE]: {
    name: TransitionProperties.MAX_SIZE,
    initialValue: "0",
    syntax: "<length> | <length-percentage>",
    inherits: true,
    ...IsUnitValue,
  },
});
