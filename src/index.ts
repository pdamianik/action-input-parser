import dotenv from 'dotenv';
import { VALID_TYPES, Options, OptionType, PrimitiveType, ParsedOpts, RequiredOptions, OptionalOptions, UndefinedPrimitiveType, RequiredOptionsWithoutType, OptionalOptionsWithoutType, OptionalOptionsWithDefault, OptionalOptionsWithoutTypeWithDefault, BaseOptionType, RequiredOptionsWithDefault, DefaultType, RequiredDefaultPrimitiveType, OptionalDefaultPrimitiveType } from './types';

dotenv.config();

const DEFAULT_OPTIONS = {
	type: String,
};

function getEnvVar(key: string) {
	const input = process.env[`INPUT_${key.replace(/ /g, '_').toUpperCase()}`]?.trim();
	const raw = process.env[key]?.trim();

	return input ?? raw;
}

function parseArray(val: string) {
	if (val.length === 0) return [];
	return val
		.replace(/,$/, '')
		.split(/(?:,\n)|[,\n]/)
		.map(n => n.trim());
}

function parseBoolean(val: string) {
	if (val.length === 0) return undefined;
	const trueValue = new Set(['true', 'True', 'TRUE']);
	const falseValue = new Set(['false', 'False', 'FALSE']);

	if (trueValue.has(val)) return true;
	if (falseValue.has(val)) return false;

	throw new Error('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
}

function parseNumber(val: string) {
	if (val.length === 0) return undefined;
	const parsed = Number(val);

	if (isNaN(parsed)) throw new Error('input has to be a valid number');

	return parsed;
}

function parseValue<T extends OptionType>(value: string, type: T): PrimitiveType<T> {
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

	return value as any;
}

type ParameterPrimitive<Parameter extends string | string[] | Options<OptionType>> =
	Parameter extends string ? string :
	Parameter extends string[] ? string :
	Parameter extends RequiredOptionsWithoutType ? string :
	Parameter extends OptionalOptionsWithoutType ? string | undefined :
	Parameter extends OptionalOptionsWithoutTypeWithDefault ? string :
	Parameter extends RequiredOptions<infer OT extends OptionType> ?
	PrimitiveType<OT> :
	Parameter extends OptionalOptions<infer OT extends OptionType> ?
	UndefinedPrimitiveType<OT> :
	Parameter extends OptionalOptionsWithDefault<infer OT extends OptionType, infer DT> ?
	OptionalDefaultPrimitiveType<OT, DT> :
	Parameter extends RequiredOptionsWithDefault<infer OT extends OptionType, infer DT> ?
	RequiredDefaultPrimitiveType<OT, DT> :
	Parameter extends Options<infer OT extends OptionType> ?
	UndefinedPrimitiveType<OT> :
	never;
type ParameterOptionType<Parameter extends string | string[] | Options<OptionType>> =
	Parameter extends string ? StringConstructor :
	Parameter extends string[] ? StringConstructor :
	Parameter extends Options<infer OT extends OptionType> ?
	OT :
	never;
export function getInput(key: string): string | undefined;
export function getInput(key: string[]): string | undefined;
export function getInput(key: RequiredOptionsWithoutType): string;
export function getInput(key: OptionalOptionsWithoutType): string | undefined;
export function getInput(key: OptionalOptionsWithoutTypeWithDefault): string;
export function getInput<T extends OptionType>(key: RequiredOptions<T>): PrimitiveType<T>;
export function getInput<T extends OptionType>(key: OptionalOptions<T>): UndefinedPrimitiveType<T>;
export function getInput<T extends OptionType, DT extends DefaultType<T>>(key: OptionalOptionsWithDefault<T, DT>): OptionalDefaultPrimitiveType<T, DT>;
export function getInput<T extends OptionType, DT extends DefaultType<T>>(key: RequiredOptionsWithDefault<T, DT>): RequiredDefaultPrimitiveType<T, DT>;
export function getInput<Parameter extends string | string[] | Options<OptionType>>(key: Parameter): ParameterPrimitive<Parameter> {
	let options: ParsedOpts<ParameterOptionType<Parameter>>
	if (typeof key === 'string' || Array.isArray(key)) {
		options = {
			...DEFAULT_OPTIONS,
			key,
		} as ParsedOpts<ParameterOptionType<Parameter>>;
	} else if (typeof key === 'object') {
		options = {
			...DEFAULT_OPTIONS,
			...key
		} as ParsedOpts<ParameterOptionType<Parameter>>;
	} else {
		throw new Error('No key for input specified')
	}

	if (!options.key) throw new Error('No key for input specified');

	if (!VALID_TYPES.has(options.type ?? String as any)) {
		if (options.type instanceof Array) {
			if (options.type.length === 0) {
				throw new Error('option array type has to have at least one element');
			} else {
				for (let type of options.type) {
					if (!VALID_TYPES.has(type)) {
						throw new Error('option array type elements have to be either `string`, `boolean` or `number`');
					}
				}
			}
		} else {
			throw new Error('option type has to be either `string`, `boolean` or `number`');
		}
	}

	const val = typeof options.key === 'string' ? getEnvVar(options.key) : options.key.map(getEnvVar).find(item => item);

	let parsed = val !== undefined ? parseValue(val, options.type ?? String as any) : undefined;

	if (parsed === undefined) {
		if (options.required) {
			if (val === '') {
				throw new Error(`Input \`${options.key}\` is required but empty.`);
			} else {
				throw new Error(`Input \`${options.key}\` is required but was not provided.`);
			}
		}
		if (options.default !== undefined) return options.default as any;
		if (options.type instanceof Array && typeof val === 'string') parsed = [] as any;
	} else if (options.type instanceof Array && typeof val === 'string') {
		const defaultArray = options.default as any[] ?? [];
		const typeLength = options.type.length === 1 ? 0 : options.type.length;
		let tmp = [];
		for (let index = 0; index < Math.max(typeLength, (parsed as any[]).length, defaultArray.length); index++) {
			tmp.push((parsed as any[])[index] ?? defaultArray[index]);
		}
		parsed = tmp as any;
		if (options.required && (parsed as any[]).findIndex(elem => elem === undefined) !== -1) {
			throw new Error(`Input array \`${options.key}\` contains elements that couldn't be parsed`);
		}
	}

	if (options.modifier) return options.modifier(parsed as any) as any;
	return parsed as any;
}

type ParametersPrimitive<Input extends { [key: string]: string | string[] | Options<OptionType> }> = {
	[Key in keyof Input]:
	Input[Key] extends string ? string | undefined :
	Input[Key] extends string[] ? string | undefined :
	Input[Key] extends RequiredOptionsWithoutType ? string :
	Input[Key] extends OptionalOptionsWithoutType ? string | undefined :
	Input[Key] extends OptionalOptionsWithoutTypeWithDefault ? string :
	Input[Key] extends RequiredOptions<infer T extends OptionType> ? PrimitiveType<T> :
	Input[Key] extends OptionalOptions<infer T extends OptionType> ? UndefinedPrimitiveType<T> :
	Input[Key] extends OptionalOptionsWithDefault<infer T extends OptionType, infer DT> ? OptionalDefaultPrimitiveType<T, DT> :
	Input[Key] extends RequiredOptionsWithDefault<infer T extends OptionType, infer DT> ? RequiredDefaultPrimitiveType<T, DT> :
	never;
}

export function getInputs<Inputs extends { [key: string]: string | string[] | Options<OptionType> }>(inputs: Inputs): ParametersPrimitive<Inputs> {
	for (const [k, v] of Object.entries(inputs)) {
		(inputs[k] as any) = getInput(v as any);
	}
	return inputs as any
}
