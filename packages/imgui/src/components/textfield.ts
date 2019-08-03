import { Predicate } from "@thi.ng/api";
import { pointInside, rect } from "@thi.ng/geom";
import { fitClamped } from "@thi.ng/math";
import { CONTROL_KEYS, Key, MouseButton } from "../api";
import { IMGUI } from "../gui";
import { textLabel } from "./textlabel";
import { tooltip } from "./tooltip";

export const textField = (
    gui: IMGUI,
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    label: [string, number?, number?],
    filter: Predicate<string> = () => true,
    info?: string
) => {
    const theme = gui.theme;
    const cw = theme.charWidth;
    const pad = theme.pad;
    const maxLen = Math.max(1, ((w - pad * 2) / cw) | 0);
    const txt = label[0];
    const txtLen = txt.length;
    const maxOffset = Math.max(0, txtLen - maxLen);
    const offset = label[2] !== undefined ? label[2] : maxOffset;
    const drawTxt = txt.substr(offset, maxLen);
    const r = rect([x, y], [w, h]);
    const hover = pointInside(r, gui.mouse);
    if (hover) {
        gui.hotID = id;
        if (gui.buttons & MouseButton.LEFT) {
            if (gui.activeID === "") {
                gui.activeID = id;
            }
            label[1] = Math.min(
                Math.round(
                    fitClamped(
                        gui.mouse[0],
                        x + pad,
                        x + w - pad,
                        offset,
                        offset + maxLen
                    )
                ),
                txtLen
            );
            label[2] = offset;
        }
        info && tooltip(gui, info);
    }
    const focused = gui.requestFocus(id);
    r.attribs = {
        fill: gui.bgColor(focused || hover),
        stroke: gui.focusColor(id)
    };
    gui.add(
        r,
        textLabel(
            [x + pad, y + h / 2 + theme.baseLine],
            gui.textColor(false),
            drawTxt
        )
    );
    if (gui.focusID == id) {
        const cursor = label[1] !== undefined ? label[1] : txtLen;
        const drawCursor = Math.min(cursor - offset, maxLen);
        const xx = x + pad + drawCursor * cw;
        gui.time % 0.5 < 0.25 &&
            gui.add([
                "line",
                { stroke: theme.cursor },
                [xx, y + 4],
                [xx, y + h - 4]
            ]);
        // gui.add(
        //     textLabel(
        //         [x, y + 32],
        //         "#fff",
        //         `c: ${cursor} dc: ${drawCursor} o: ${offset}`
        //     )
        // );
        const k = gui.key;
        switch (k) {
            case "":
                break;
            case Key.TAB:
                gui.switchFocus();
                break;
            case Key.ENTER:
                return true;
            case Key.BACKSPACE:
                if (cursor > 0) {
                    const next = gui.isAltDown()
                        ? prevNonAlpha(txt, cursor - 1)
                        : cursor - 1;
                    label[0] = txt.substr(0, next) + txt.substr(cursor);
                    movePrevWord(
                        label,
                        next,
                        next - cursor,
                        drawCursor,
                        offset
                    );
                    return true;
                }
                break;
            case Key.DELETE:
                if (cursor < txtLen) {
                    label[0] = txt.substr(0, cursor) + txt.substr(cursor + 1);
                    return true;
                }
                break;
            case Key.LEFT:
                if (cursor > 0) {
                    const next = gui.isAltDown()
                        ? prevNonAlpha(txt, cursor - 1)
                        : cursor - 1;
                    movePrevWord(
                        label,
                        next,
                        next - cursor,
                        drawCursor,
                        offset
                    );
                }
                break;
            case Key.RIGHT:
                if (cursor < txtLen) {
                    const next = gui.isAltDown()
                        ? nextNonAlpha(txt, cursor + 1)
                        : cursor + 1;
                    moveNextWord(
                        label,
                        next,
                        next - cursor,
                        drawCursor,
                        offset,
                        maxLen,
                        maxOffset
                    );
                }
                break;
            default: {
                if (!CONTROL_KEYS.has(k) && filter(k)) {
                    label[0] = txt.substr(0, cursor) + k + txt.substr(cursor);
                    label[1] = cursor + 1;
                    if (drawCursor === maxLen && offset <= maxOffset) {
                        label[2] = offset + 1;
                    }
                    return true;
                }
            }
        }
    }
    gui.lastID = id;
    return false;
};

const WS = /\s/;

const nextNonAlpha = (src: string, i: number) => {
    const n = src.length;
    while (i < n && WS.test(src[i])) i++;
    for (; i < n && !WS.test(src[i]); i++) {}
    return i;
};

const prevNonAlpha = (src: string, i: number) => {
    while (i > 0 && WS.test(src[i])) i--;
    for (; i > 0 && !WS.test(src[i]); i--) {}
    return i;
};

const movePrevWord = (
    label: [string, number?, number?],
    next: number,
    delta: number,
    drawCursor: number,
    offset: number
) => {
    label[1] = next;
    if (drawCursor + delta < 0) {
        label[2] = Math.max(offset + delta, 0);
    }
};

const moveNextWord = (
    label: [string, number?, number?],
    next: number,
    delta: number,
    drawCursor: number,
    offset: number,
    maxLen: number,
    maxOffset: number
) => {
    label[1] = next;
    if (drawCursor + delta > maxLen) {
        label[2] = Math.min(offset + delta, maxOffset);
    }
};
