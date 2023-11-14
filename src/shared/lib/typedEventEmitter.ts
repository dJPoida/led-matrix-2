import { EventEmitter } from 'events';
import { Listener } from '../types/listener.type';
import { classLoggerFactory } from '../../server/helpers/classLoggerFactory.helper';

type SE = string | symbol;

/**
 * Typed Event Emitter
 *
 * @example
 * interface MyEventMap {
 *    eventNameA: { payload: 'hi' }
 *    eventNameB: { hello: 'world' }
 * }
 * class MyClass extends TypedEventEmitter<MyEventMap> {}
 */
export class TypedEventEmitter<P extends Record<SE, unknown>> extends EventEmitter {
  protected readonly log = classLoggerFactory(this);

  /**
   * Place an emission on the event loop so it doesn't interfere with the current execution context
   */
  emitImmediate<K extends keyof P>(event: K, payload: P[K]) {
    this.log.verbose('emitImmediate', { event, payload });
    return setImmediate(() => this.emit(event, payload));
  }

  /**
   * @inheritdoc
   */
  addListener<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('addListener', event.toString());
    return super.addListener(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  on<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('addListener', event.toString());
    return super.on(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  once<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('addListener(once)', event.toString());
    return super.once(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  prependListener<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('prependListener', event.toString());
    return super.prependListener(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  prependOnceListener<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('prependListener(once)', event.toString());
    return super.prependOnceListener(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  off<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('removeListener', event.toString());
    return super.off(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  removeAllListeners<K extends keyof P>(event?: K) {
    this.log.verbose('removeAllListeners', event?.toString() ?? undefined);
    return super.removeAllListeners(event as SE);
  }

  /**
   * @inheritdoc
   */
  removeListener<K extends keyof P>(event: K, listener: Listener<P[K]>) {
    this.log.verbose('removeListener', event.toString());
    return super.removeListener(event as SE, listener);
  }

  /**
   * @inheritdoc
   */
  emit<K extends keyof P>(event: K, payload: P[K]) {
    this.log.verbose('emit', payload ? { event, payload } : event.toString());
    return super.emit(event as SE, payload);
  }

  /**
   * @inheritdoc
   */
  eventNames(): (string | symbol)[] {
    return this.eventNames();
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners<K extends keyof P>(event: K): Function[] {
    return super.listeners(event as SE);
  }

  /**
   * @inheritdoc
   */
  listenerCount<K extends keyof P>(event: K): number {
    return super.listenerCount(event as SE);
  }

  /**
   * @inheritdoc
   */
  getMaxListeners(): number {
    return super.getMaxListeners();
  }

  /**
   * @inheritdoc
   */
  setMaxListeners(maxListeners: number): this {
    this.log.verbose('setMaxListeners', maxListeners);
    return super.setMaxListeners(maxListeners);
  }
}
