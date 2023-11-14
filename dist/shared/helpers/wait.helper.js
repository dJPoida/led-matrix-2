"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
/**
 * Resolve a timeout after a duration
 *
 * Useful for synchronously waiting without blocking other threads
 *
 * @example
 * await wait(100); // Wait for 100ms
 */
const wait = (dur) => new Promise((res) => setTimeout(res, dur));
exports.wait = wait;
