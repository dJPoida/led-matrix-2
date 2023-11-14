export interface Listener<P> {
  (payload: P): unknown;
}
