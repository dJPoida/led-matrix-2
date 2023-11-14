"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeJsonStringify = void 0;
/**
 * Same as JSON.stringify but protects against recursive references
 */
const safeJsonStringify = (obj) => {
    const cache = [];
    const str = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }, 2);
    return str;
};
exports.safeJsonStringify = safeJsonStringify;
