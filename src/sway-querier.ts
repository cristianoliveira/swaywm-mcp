// This module contains a function to query swayWM objects in a tree structure.
// 
// FIXME: add missing types
// FIXME: add missing docstring
export const find = (node: any, predicate: (node: any) => boolean): any[] => {
    const result: any[] = [];
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

