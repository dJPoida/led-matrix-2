"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fpsToFrameDuration = void 0;
/**
 * Converts a frame rate to a frame duration (in milliseconds)
 *
 * i.e. 60FPS = 1/60 * 1,000 = 16.667
 *
 * @example const frameDuration = fpsToFrameDuration (60);
 */
const fpsToFrameDuration = (frameRate) => (1 / frameRate) * 1000;
exports.fpsToFrameDuration = fpsToFrameDuration;
