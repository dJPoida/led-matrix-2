"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
const events_1 = require("events");
const classLoggerFactory_helper_1 = require("../../server/helpers/classLoggerFactory.helper");
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
class TypedEventEmitter extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.log = (0, classLoggerFactory_helper_1.classLoggerFactory)(this);
    }
    /**
     * Place an emission on the event loop so it doesn't interfere with the current execution context
     */
    emitImmediate(event, payload) {
        this.log.verbose('emitImmediate', { event, payload });
        return setImmediate(() => this.emit(event, payload));
    }
    /**
     * @inheritdoc
     */
    addListener(event, listener) {
        this.log.verbose('addListener', event.toString());
        return super.addListener(event, listener);
    }
    /**
     * @inheritdoc
     */
    on(event, listener) {
        this.log.verbose('addListener', event.toString());
        return super.on(event, listener);
    }
    /**
     * @inheritdoc
     */
    once(event, listener) {
        this.log.verbose('addListener(once)', event.toString());
        return super.once(event, listener);
    }
    /**
     * @inheritdoc
     */
    prependListener(event, listener) {
        this.log.verbose('prependListener', event.toString());
        return super.prependListener(event, listener);
    }
    /**
     * @inheritdoc
     */
    prependOnceListener(event, listener) {
        this.log.verbose('prependListener(once)', event.toString());
        return super.prependOnceListener(event, listener);
    }
    /**
     * @inheritdoc
     */
    off(event, listener) {
        this.log.verbose('removeListener', event.toString());
        return super.off(event, listener);
    }
    /**
     * @inheritdoc
     */
    removeAllListeners(event) {
        this.log.verbose('removeAllListeners', event?.toString() ?? undefined);
        return super.removeAllListeners(event);
    }
    /**
     * @inheritdoc
     */
    removeListener(event, listener) {
        this.log.verbose('removeListener', event.toString());
        return super.removeListener(event, listener);
    }
    /**
     * @inheritdoc
     */
    emit(event, payload) {
        this.log.verbose('emit', payload ? { event, payload } : event.toString());
        return super.emit(event, payload);
    }
    /**
     * @inheritdoc
     */
    eventNames() {
        return this.eventNames();
    }
    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    listeners(event) {
        return super.listeners(event);
    }
    /**
     * @inheritdoc
     */
    listenerCount(event) {
        return super.listenerCount(event);
    }
    /**
     * @inheritdoc
     */
    getMaxListeners() {
        return super.getMaxListeners();
    }
    /**
     * @inheritdoc
     */
    setMaxListeners(maxListeners) {
        this.log.verbose('setMaxListeners', maxListeners);
        return super.setMaxListeners(maxListeners);
    }
}
exports.TypedEventEmitter = TypedEventEmitter;
