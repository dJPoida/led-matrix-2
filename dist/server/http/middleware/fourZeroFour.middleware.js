"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fourZeroFourMiddleware = void 0;
const fourZeroFourMiddleware = function fourZeroFourMiddleware(req, res) {
    res.status(404).json({ message: 'Not found' });
};
exports.fourZeroFourMiddleware = fourZeroFourMiddleware;
