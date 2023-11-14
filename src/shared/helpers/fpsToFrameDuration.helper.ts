/**
 * Converts a frame rate to a frame duration (in milliseconds)
 *
 * i.e. 60FPS = 1/60 * 1,000 = 16.667
 *
 * @example const frameDuration = fpsToFrameDuration (60);
 */
export const fpsToFrameDuration = (frameRate: number) => (1 / frameRate) * 1000;
