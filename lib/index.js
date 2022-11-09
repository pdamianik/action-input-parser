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
var os_1 = require("os");
var types_1 = require("./types");
dotenv_1.default.config();
var DEFAULT_OPTIONS = {
    type: String,
};
function getEnvVar(key) {
    var _a, _b;
    var input = (_a = process.env["INPUT_".concat(key.replace(/ /g, '_').toUpperCase())]) === null || _a === void 0 ? void 0 : _a.split(os_1.EOL).map(function (el) { return el.trim(); }).join(os_1.EOL);
    var raw = (_b = process.env[key]) === null || _b === void 0 ? void 0 : _b.split(os_1.EOL).map(function (el) { return el.trim(); }).join(os_1.EOL);
    return input !== null && input !== void 0 ? input : raw;
}
function parseArray(val) {
    return val
        .split(/(?:,\n)|[,\n]/)
        .map(function (n) { return n.trim(); });
}
function parseBoolean(val) {
    var trueValue = new Set(['true', 'True', 'TRUE']);
    var falseValue = new Set(['false', 'False', 'FALSE']);
    if (trueValue.has(val))
        return true;
    if (falseValue.has(val))
        return false;
    throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
}
function parseNumber(val) {
    var parsed = Number(val);
    if (isNaN(parsed))
        throw new Error('input has to be a valid number');
    return parsed;
}
function parseValue(value, type) {
    if (value.length === 0)
        return undefined;
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
    if (type === String) {
        return value;
    }
    if (type instanceof Function) {
        return type(value);
    }
    throw new Error("type `".concat(type, "` is invalid"));
}
function getInput(input) {
    var _a;
    var options;
    if (typeof input === 'string' || Array.isArray(input)) {
        options = __assign(__assign({}, DEFAULT_OPTIONS), { input: input });
    }
    else if (typeof input === 'object' && (typeof input.input === 'string' || Array.isArray(input.input))) {
        options = __assign(__assign({}, DEFAULT_OPTIONS), input);
    }
    else {
        throw new Error('key type has to be either `string` or `string[]`');
    }
    if (!options.input)
        throw new Error('No key for input specified');
    if (!types_1.VALID_TYPES.has(options.type)) {
        if (options.type instanceof Array) {
            if (options.type.length === 0) {
                throw new Error('option array type has to have at least one element');
            }
            for (var index in options.type) {
                var type = options.type[index];
                if (!types_1.VALID_TYPES.has(type) && !(type instanceof Function)) {
                    throw new Error("option array type element at index ".concat(index, " has to be either a `string`, `boolean`, `number` or `function`"));
                }
            }
        }
        else if (options.type instanceof Function) {
        }
        else {
            throw new Error('option type has to be either `string`, `boolean`, `number` or `function`');
        }
    }
    var val = typeof options.input === 'string' ? getEnvVar(options.input) : options.input.map(getEnvVar).find(function (item) { return item; });
    var parsed = val !== undefined ? parseValue(val, options.type) : undefined;
    if (options.type instanceof Array) {
        if (options.default instanceof Array || typeof val === 'string') {
            var parsedArray = (parsed !== null && parsed !== void 0 ? parsed : []);
            var tmp = [], typeLength = void 0, defaultValue = void 0;
            if (options.default instanceof Array) {
                typeLength = options.type.length === 1 ? Math.max(options.default.length, parsedArray.length) : options.type.length;
                defaultValue = function (index) { return options.default[index]; };
            }
            else {
                typeLength = options.type.length === 1 ? parsedArray.length : options.type.length;
                defaultValue = function () { return options.default; };
            }
            for (var index = 0; index < typeLength; index++) {
                tmp.push((_a = parsedArray[index]) !== null && _a !== void 0 ? _a : defaultValue(index));
            }
            parsed = tmp;
        }
    }
    else if (options.type === String && val === '') {
        parsed !== null && parsed !== void 0 ? parsed : (parsed = '');
    }
    else {
        parsed !== null && parsed !== void 0 ? parsed : (parsed = options.default);
    }
    if (options.required) {
        if (parsed === undefined) {
            if (val === '') {
                throw new Error("input `".concat(options.input, "` is required but empty"));
            }
            else {
                throw new Error("input `".concat(options.input, "` is required but was not provided"));
            }
        }
        if (options.type instanceof Array && parsed.findIndex(function (elem) { return elem === undefined; }) !== -1) {
            throw new Error("input array `".concat(options.input, "` contains elements that could not be parsed"));
        }
    }
    return parsed;
}
exports.getInput = getInput;
function getInputs(inputs) {
    var _a;
    var inputName;
    try {
        for (var _i = 0, _b = Object.entries(inputs); _i < _b.length; _i++) {
            var _c = _b[_i], k = _c[0], v = _c[1];
            inputName = k;
            var inputConfig = void 0;
            if (v === undefined) {
                inputConfig = k;
            }
            else if (typeof v === 'string' || Array.isArray(v)) {
                inputConfig = v;
            }
            else if (typeof v === 'object') {
                inputConfig = v;
                (_a = inputConfig.input) !== null && _a !== void 0 ? _a : (inputConfig.input = k);
            }
            else {
                throw Error('option config type has to be either `undefined`, `string`, `string[]` or `object`');
            }
            inputs[k] = getInput(v || k);
        }
        return inputs;
    }
    catch (error) {
        if (error instanceof Error) {
            error.message = "config `".concat(inputName, "`: ").concat(error.message);
            throw error;
        }
        throw error;
    }
}
exports.getInputs = getInputs;
