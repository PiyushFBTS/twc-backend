"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPostgresDateTime = void 0;
const toPostgresDateTime = (dateString) => {
    if (!dateString)
        return null;
    return new Date(dateString).toISOString();
};
exports.toPostgresDateTime = toPostgresDateTime;
