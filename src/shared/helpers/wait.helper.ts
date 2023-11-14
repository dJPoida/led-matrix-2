/**
 * Resolve a timeout after a duration
 *
 * Useful for synchronously waiting without blocking other threads
 *
 * @example
 * await wait(100); // Wait for 100ms
 */
export const wait = (dur: number): Promise<ReturnType<typeof setTimeout>> => new Promise((res) => setTimeout(res, dur));
