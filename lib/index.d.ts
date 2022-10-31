import { OptionType, Options, OptionPrimitiveResult, RequiredType, Known, OptionalOptions, RequiredOptions, Expand } from './types';
export declare function getInput(input: string): string | undefined;
export declare function getInput(input: string[]): string | undefined;
export declare function getInput<OT extends OptionType, DT>(options: OptionalOptions<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, false>;
export declare function getInput<OT extends OptionType, DT>(options: RequiredOptions<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, true>;
declare type ParametersPrimitive<Input extends {
    [key: string]: string | string[] | Options<OptionType, any, RequiredType>;
}> = {
    [Key in keyof Input]: Input[Key] extends undefined ? string | undefined : Input[Key] extends string ? string | undefined : Input[Key] extends string[] ? string | undefined : Input[Key] extends RequiredOptions<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, true> : Input[Key] extends OptionalOptions<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, false> : Input[Key] extends Object ? string | undefined : never;
};
export declare function getInputs<Inputs extends {
    [key: string]: string | string[] | Options<OptionType, any, RequiredType>;
}>(inputs: Inputs): Expand<ParametersPrimitive<Inputs>>;
export {};
