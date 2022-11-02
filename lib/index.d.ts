import { OptionType, OptionPrimitiveResult, RequiredType, Known, OptionalInputOption, RequiredInputOption, Expand, RequiredInputsOption, OptionalInputsOption, InputsOption } from './types';
export declare function getInput(input: string): string | undefined;
export declare function getInput(input: string[]): string | undefined;
export declare function getInput<OT extends OptionType, DT>(options: OptionalInputOption<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, false>;
export declare function getInput<OT extends OptionType, DT>(options: RequiredInputOption<OT, DT>): OptionPrimitiveResult<Known<OT>, Known<DT>, true>;
declare type ParametersPrimitive<Input extends {
    [key: string]: undefined | string | string[] | InputsOption<OptionType, any, RequiredType>;
}> = {
    [Key in keyof Input]: Input[Key] extends undefined ? string | undefined : Input[Key] extends string ? string | undefined : Input[Key] extends string[] ? string | undefined : Input[Key] extends RequiredInputsOption<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, true> : Input[Key] extends OptionalInputsOption<infer OT extends OptionType, infer DT> ? OptionPrimitiveResult<Known<OT>, Known<DT>, false> : Input[Key] extends Object ? string | undefined : never;
};
export declare function getInputs<Inputs extends {
    [key: string]: undefined | string | string[] | InputsOption<OptionType, any, RequiredType>;
}>(inputs: Inputs): Expand<ParametersPrimitive<Inputs>>;
export {};
