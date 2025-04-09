import type { SwayNode } from "./types.js";

// FIXME: add missing docstring
export const find = (node: SwayNode, predicate: (node: SwayNode) => boolean): SwayNode[] => {
    const result: SwayNode[] = [];
    if (predicate(node)) {
        result.push(node);
    }
    if (node.nodes) {
        for (const child of node.nodes) {
            result.push(...find(child, predicate));
        }
    }
    return result;
}
