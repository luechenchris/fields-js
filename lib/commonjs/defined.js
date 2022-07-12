"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = void 0;
/**
 * Checks if the supplied variable contains a value.
 * @param {*} value
 * @returns
 */
function isDefined(value) {
    if (typeof value !== 'undefined' && value !== null && value !== '' && value !== {}) {
        return true;
    }
    else {
        return false;
    }
}
exports.isDefined = isDefined;
