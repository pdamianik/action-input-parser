import dotenv from 'dotenv';
import { VALID_TYPES, OptionType, ParseFunction, PrimitiveType, Options, OptionPrimitiveResult, RequiredType, Known, BaseOptions, OptionalOptions, RequiredOptions } from './types';

dotenv.config();

const DEFAULT_OPTIONS = {
	type: String,
};

function getEnvVar(key: string) {
	const input = process.env[`INPUT_${key.replace(/ /g, '_').toUpperCase()}`]?.trimEnd();
	const raw = process.env[key]?.trimEnd();

	return input ?? raw;
}

function parseArray(val: string) {
	return val
		.replace(/,$/, '')
		.split(/(?:,\n)|[,\n]/)
		.map(n => n.trim());
}

function parseBoolean(val: string) {
	const trueValue = new Set(['true', 'True', 'TRUE']);
	const falseValue = new Set(['false', 'False', 'FALSE']);

	if (trueValue.has(val)) return true;
	if (falseValue.has(val)) return false;

	throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
}

function parseNumber(val: string) {
	const parsed = Number(val);

	if (isNaN(parsed)) throw new Error('input has to be a valid number');

	return parsed;
}

function parseValue<T extends OptionType>(value: string, type: T): PrimitiveType<T> | undefined {
	if (value.length === 0) return undefined;

	if (type instanceof Array) {
		if (type.length === 0) {
			throw new Error('array type has to have at least one element');
		} else if (type.length === 1) {
			return parseArray(value).map(val => parseValue(val, type[0])) as any;
		} else {
			return parseArray(value).slice(0, type.length).map((val, index) => parseValue(val, type[index])) as any;
		}
	}

	if (type === Boolean) {
		return parseBoolean(value) as any;
	}

	if (type === Number) {
		return parseNumber(value) as any;
	}

	if (type === String) {
		return value as any;
	}

	if (type instanceof Function) {
		return (type as ParseFunction<any>)(value) as any
	}

	throw new Error(`type \`${type}\` is invalid`)
}

type ParameterPrimitive<Parameter extends string | string[] | Options<OptionType, any, RequiredType>> =
	Parameter extends string ? string | undefined :
	Parameter extends string[] ? string | undefined :
	Parameter extends BaseOptions<infer OT extends OptionType, infer DT, infer RT extends RequiredType> ? OptionPrimitiveResult<Known<OT>, Known<DT>, Known<RT>> :
	never;

export function getInput(input: string): string | undefined;
export function getInput(input: string[]): string | undefined;
export function getInput<OT extends OptionType, DT>(options: OptionalOptions<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, false>;
export function getInput<OT extends OptionType, DT>(options: RequiredOptions<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, true>;
export function getInput<Parameter extends string | string[] | Options<OptionType, any, RequiredType>>(input: Parameter): ParameterPrimitive<Parameter> {
	let options: Options<OptionType, any, RequiredType>;
	if (typeof input === 'string' || Array.isArray(input)) {
		options = {
			...DEFAULT_OPTIONS,
			input: input,
		};
	} else if (typeof input === 'object') {
		options = {
			...DEFAULT_OPTIONS,
			...input
		};
	} else {
		throw new Error('key type has to be either `string` or `string[]`');
	}

	if (!options.input) throw new Error('No key for input specified');

	if (!VALID_TYPES.has(options.type ?? String as any)) {
		if (options.type instanceof Array) {
			if (options.type.length === 0) {
				throw new Error('option array type has to have at least one element');
			}

			for (let type of options.type) {
				if (!VALID_TYPES.has(type) && !(type instanceof Function)) {
					throw new Error('option array type elements have to be either `string`, `boolean`, `number` or `function`');
				}
			}
		} else if (options.type instanceof Function) {

		} else {
			throw new Error('option type has to be either `string`, `boolean`, `number` or `function`');
		}
	}

	const val = typeof options.input === 'string' ? getEnvVar(options.input) : options.input.map(getEnvVar).find(item => item);

	let parsed = val !== undefined ? parseValue(val, options.type as any ?? String) : undefined;

	if (options.type instanceof Array) {
		const parsedArray = parsed as any[] ?? [] as any[];
		let tmp = [];

		if (options.default instanceof Array) {
			const defaultArray = options.default as any[] ?? [];
			const typeLength = options.type.length === 1 ? Math.max(defaultArray.length, parsedArray.length) : options.type.length;

			for (let index = 0; index < typeLength; index++) {
				tmp.push(parsedArray[index] ?? defaultArray[index]);
			}

			parsed = tmp as any[];
		} else if (typeof val === 'string') {
			const typeLength = options.type.length === 1 ? parsedArray.length : options.type.length;

			for (let index = 0; index < typeLength; index++) {
				tmp.push(parsedArray[index] ?? options.default);
			}

			parsed = tmp as any[];
		}
	} else if (options.type === String && val === '') {
		parsed ??= '';
	} else {
		parsed ??= options.default;
	}

	if (options.required) {
		if (parsed === undefined) {
			if (val === '') {
				throw new Error(`input \`${options.input}\` is required but empty`);
			} else {
				throw new Error(`input \`${options.input}\` is required but was not provided`);
			}
		}

		if (options.type instanceof Array && (parsed as any[]).findIndex(elem => elem === undefined) !== -1) {
			throw new Error(`input array \`${options.input}\` contains elements that could not be parsed`);
		}
	}

	return parsed as any;
}

type ParametersPrimitive<Input extends { [key: string]: string | string[] | Options<OptionType, any, RequiredType> }> = {
	[Key in keyof Input]:
	Input[Key] extends undefined ? string | undefined :
	Input[Key] extends string ? string | undefined :
	Input[Key] extends string[] ? string | undefined :
	Input[Key] extends RequiredOptions<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, true> :
	Input[Key] extends OptionalOptions<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, false> :
	Input[Key] extends Object ? string | undefined :
	never;
}
export function getInputs<Inputs extends { [key: string]: string | string[] | Options<OptionType, any, RequiredType> }>(inputs: Inputs): ParametersPrimitive<Inputs> {
	for (const [k, v] of Object.entries(inputs)) {
		(inputs[k] as any) = getInput(v as any ?? k);
	}
	return inputs as any
}
