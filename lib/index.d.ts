import { Options, OptionType, PrimitiveType, RequiredOptions, OptionalOptions, UndefinedPrimitiveType, RequiredOptionsWithoutType, OptionalOptionsWithoutType, OptionalOptionsWithDefault, OptionalOptionsWithoutTypeWithDefault, RequiredOptionsWithDefault, DefaultType, RequiredDefaultPrimitiveType, OptionalDefaultPrimitiveType } from './types';
export declare function getInput(key: string): string | undefined;
export declare function getInput(key: string[]): string | undefined;
export declare function getInput(key: RequiredOptionsWithoutType): string;
export declare function getInput(key: OptionalOptionsWithoutType): string | undefined;
export declare function getInput(key: OptionalOptionsWithoutTypeWithDefault): string;
export declare function getInput<T extends OptionType>(key: RequiredOptions<T>): PrimitiveType<T>;
export declare function getInput<T extends OptionType>(key: OptionalOptions<T>): UndefinedPrimitiveType<T>;
export declare function getInput<T extends OptionType, DT extends DefaultType<T>>(key: OptionalOptionsWithDefault<T, DT>): OptionalDefaultPrimitiveType<T, DT>;
export declare function getInput<T extends OptionType, DT extends DefaultType<T>>(key: RequiredOptionsWithDefault<T, DT>): RequiredDefaultPrimitiveType<T, DT>;
declare type ParametersPrimitive<Input extends {
    [key: string]: string | string[] | Options<OptionType>;
}> = {
    [Key in keyof Input]: Input[Key] extends string ? string | undefined : Input[Key] extends string[] ? string | undefined : Input[Key] extends RequiredOptionsWithoutType ? string : Input[Key] extends OptionalOptionsWithoutType ? string | undefined : Input[Key] extends OptionalOptionsWithoutTypeWithDefault ? string : Input[Key] extends RequiredOptions<infer T extends OptionType> ? PrimitiveType<T> : Input[Key] extends OptionalOptions<infer T extends OptionType> ? UndefinedPrimitiveType<T> : Input[Key] extends OptionalOptionsWithDefault<infer T extends OptionType, infer DT> ? OptionalDefaultPrimitiveType<T, DT> : Input[Key] extends RequiredOptionsWithDefault<infer T extends OptionType, infer DT> ? RequiredDefaultPrimitiveType<T, DT> : never;
};
export declare function getInputs<Inputs extends {
    [key: string]: string | string[] | Options<OptionType>;
}>(inputs: Inputs): ParametersPrimitive<Inputs>;
export {};
