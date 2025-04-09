interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Mode {
    width: number;
    height: number;
    refresh: number;
    picture_aspect_ratio: string;
}

interface IdleInhibitors {
    user: string;
    application: string;
}

interface WindowProperties {
    class: string;
    instance: string;
    title: string;
    transient_for: number | null;
    window_role: string;
    window_type: string;
}

interface SwayNode {
    id: number;
    type: string;
    orientation: string;
    percent: number | null;
    urgent: boolean;
    marks: any[];
    focused: boolean;
    layout: string;
    border: string;
    current_border_width: number;
    rect: Rect;
    deco_rect: Rect;
    window_rect: Rect;
    geometry: Rect;
    name: string;
    window: number | null;
    nodes: SwayNode[];
    floating_nodes: any[];
    focus: number[];
    fullscreen_mode: number;
    sticky: boolean;
    floating: string | null;
    scratchpad_state: string | null;
    pid?: number;
    app_id?: string | null;
    visible?: boolean;
    max_render_time?: number;
    allow_tearing?: boolean;
    shell?: string;
    inhibit_idle?: boolean;
    idle_inhibitors?: IdleInhibitors;
    window_properties?: WindowProperties;
    num?: number;
    output?: string;
    representation?: string;
    primary?: boolean;
    make?: string;
    model?: string;
    serial?: string;
    modes?: Mode[];
    non_desktop?: boolean;
    active?: boolean;
    dpms?: boolean;
    power?: boolean;
    scale?: number;
    scale_filter?: string;
    transform?: string;
    adaptive_sync_status?: string;
    current_workspace?: string;
    current_mode?: Mode;
}

interface SwayOutput {
    id: number;
    type: string;
    orientation: string;
    percent: number | null;
    urgent: boolean;
    marks: any[];
    focused: boolean;
    layout: string;
    border: string;
    current_border_width: number;
    rect: Rect;
    deco_rect: Rect;
    window_rect: Rect;
    geometry: Rect;
    name: string;
    window: number | null;
    nodes: SwayNode[];
    floating_nodes: any[];
    focus: number[];
    fullscreen_mode: number;
    sticky: boolean;
    floating: string | null;
    scratchpad_state: string | null;
}

interface SwayTree {
    id: number;
    type: string;
    orientation: string;
    percent: number | null;
    urgent: boolean;
    marks: any[];
    focused: boolean;
    layout: string;
    border: string;
    current_border_width: number;
    rect: Rect;
    deco_rect: Rect;
    window_rect: Rect;
    geometry: Rect;
    name: string;
    window: number | null;
    nodes: SwayOutput[];
    floating_nodes: any[];
    focus: number[];
    fullscreen_mode: number;
    sticky: boolean;
    floating: string | null;
    scratchpad_state: string | null;
}


export type {
    Rect,
    Mode,
    IdleInhibitors,
    WindowProperties,
    SwayNode,
    SwayOutput,
    SwayTree
};
