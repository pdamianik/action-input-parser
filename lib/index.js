"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = exports.getInput = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var types_1 = require("./types");
dotenv_1.default.config();
var DEFAULT_OPTIONS = {
    type: String,
};
function getEnvVar(key) {
    var _a, _b;
    var input = (_a = process.env["INPUT_".concat(key.replace(/ /g, '_').toUpperCase())]) === null || _a === void 0 ? void 0 : _a.trim();
    var raw = (_b = process.env[key]) === null || _b === void 0 ? void 0 : _b.trim();
    return input !== null && input !== void 0 ? input : raw;
}
function parseArray(val) {
    if (val.length === 0)
        return [];
    return val
        .replace(/,$/, '')
        .split(/(?:,\n)|[,\n]/)
        .map(function (n) { return n.trim(); });
}
function parseBoolean(val) {
    if (val.length === 0)
        return undefined;
    var trueValue = new Set(['true', 'True', 'TRUE']);
    var falseValue = new Set(['false', 'False', 'FALSE']);
    if (trueValue.has(val))
        return true;
    if (falseValue.has(val))
        return false;
    throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
}
function parseNumber(val) {
    if (val.length === 0)
        return undefined;
    var parsed = Number(val);
    if (isNaN(parsed))
        throw new Error('input has to be a valid number');
    return parsed;
}
function parseValue(value, type) {
    if (type instanceof Array) {
        if (type.length === 0) {
            throw new Error('array type has to have at least one element');
        }
        else if (type.length === 1) {
            return parseArray(value).map(function (val) { return parseValue(val, type[0]); });
        }
        else {
            return parseArray(value).slice(0, type.length).map(function (val, index) { return parseValue(val, type[index]); });
        }
    }
    if (type === Boolean) {
        return parseBoolean(value);
    }
    if (type === Number) {
        return parseNumber(value);
    }
    return value;
}
function getInput(key) {
    var _a, _b, _c, _d;
    var options;
    if (typeof key === 'string' || Array.isArray(key)) {
        options = __assign(__assign({}, DEFAULT_OPTIONS), { key: key });
    }
    else if (typeof key === 'object') {
        options = __assign(__assign({}, DEFAULT_OPTIONS), key);
    }
    else {
        throw new Error('No key for input specified');
    }
    if (!options.key)
        throw new Error('No key for input specified');
    if (!types_1.VALID_TYPES.has((_a = options.type) !== null && _a !== void 0 ? _a : String)) {
        if (options.type instanceof Array) {
            if (options.type.length === 0) {
                throw new Error('option array type has to have at least one element');
            }
            else {
                for (var _i = 0, _e = options.type; _i < _e.length; _i++) {
                    var type = _e[_i];
                    if (!types_1.VALID_TYPES.has(type)) {
                        throw new Error('option array type elements have to be either `string`, `boolean` or `number`');
                    }
                }
            }
        }
        else {
            throw new Error('option type has to be either `string`, `boolean` or `number`');
        }
    }
    var val = typeof options.key === 'string' ? getEnvVar(options.key) : options.key.map(getEnvVar).find(function (item) { return item; });
    var parsed = val !== undefined ? parseValue(val, (_b = options.type) !== null && _b !== void 0 ? _b : String) : undefined;
    if (parsed === undefined) {
        if (options.required) {
            if (val === '') {
                throw new Error("Input `".concat(options.key, "` is required but empty."));
            }
            else {
                throw new Error("Input `".concat(options.key, "` is required but was not provided."));
            }
        }
        if (options.default !== undefined)
            return options.default;
        if (options.type instanceof Array && typeof val === 'string')
            parsed = [];
    }
    else if (options.type instanceof Array && typeof val === 'string') {
        var defaultArray = (_c = options.default) !== null && _c !== void 0 ? _c : [];
        var typeLength = options.type.length === 1 ? 0 : options.type.length;
        var tmp = [];
        for (var index = 0; index < Math.max(typeLength, parsed.length, defaultArray.length); index++) {
            tmp.push((_d = parsed[index]) !== null && _d !== void 0 ? _d : defaultArray[index]);
        }
        parsed = tmp;
        if (options.required && parsed.findIndex(function (elem) { return elem === undefined; }) !== -1) {
            throw new Error("Input array `".concat(options.key, "` contains elements that couldn't be parsed"));
        }
    }
    if (options.modifier)
        return options.modifier(parsed);
    return parsed;
}
exports.getInput = getInput;
function getInputs(inputs) {
    for (var _i = 0, _a = Object.entries(inputs); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        inputs[k] = getInput(v);
    }
    return inputs;
}
exports.getInputs = getInputs;
