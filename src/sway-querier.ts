import type { SwayNode } from "./types.d.js";

/** 
* find - Recursively searches for nodes in a SwayNode tree that match a given predicate.
*
* @param {SwayNode} node - The root node of the tree to search.
* @param {function} predicate - A function that takes a SwayNode and returns a boolean.
*
* @returns {SwayNode[]} An array of SwayNode objects that match the predicate.
*/
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
