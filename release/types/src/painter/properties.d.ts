export declare enum TransitionProperties {
    COLOR = "--lilith-transition-color",
    LENGHT = "--lilith-transition-length",
    DIRECTION = "--lilith-transition-direction",
    DENSITY = "--lilith-transition-density",
    POSITION = "--lilith-transition-position",
    STYLE = "--lilith-transition-style",
    MAX_SIZE = "--lilith-transition-max-size"
}
export declare enum TransitionDirection {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}
export declare enum TransitionStyle {
    FADE_IN = "fade-in",
    FADE_OUT = "fade-out",
    FADE_IN_OUT = "fade-in-out"
}
export declare const lilith_properties: {
    "--lilith-transition-direction": {
        is_keyword_value: boolean;
        name: TransitionProperties;
        initialValue: TransitionDirection;
        syntax: string;
        inherits: true;
    };
    "--lilith-transition-color": {
        is_style_value: boolean;
        name: TransitionProperties;
        inherits: true;
        syntax: string;
        initialValue: string;
    };
    "--lilith-transition-density": {
        is_unit_value: boolean;
        name: TransitionProperties;
        inherits: true;
        syntax: string;
        initialValue: string;
    };
    "--lilith-transition-length": {
        is_unit_value: boolean;
        name: TransitionProperties;
        initialValue: string;
        syntax: string;
        inherits: true;
    };
    "--lilith-transition-position": {
        is_unit_value: boolean;
        name: TransitionProperties;
        initialValue: string;
        syntax: string;
        inherits: false;
    };
    "--lilith-transition-style": {
        is_keyword_value: boolean;
        name: TransitionProperties;
        initialValue: TransitionStyle;
        syntax: string;
        inherits: true;
    };
    "--lilith-transition-max-size": {
        is_unit_value: boolean;
        name: TransitionProperties;
        initialValue: string;
        syntax: string;
        inherits: true;
    };
};
