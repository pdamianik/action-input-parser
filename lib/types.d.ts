export declare type Expand<T> = {
    [K in keyof T]: T[K];
};
export declare type Defined<T> = T extends undefined | null ? never : T;
export declare type DefinedOne<T> = T extends Object ? {
    [Key in keyof T]: Defined<T[Key]>;
} : Defined<T>;
export declare type DefinedRecursive<T> = T extends Object ? {
    [Key in keyof T]: DefinedRecursive<T[Key]>;
} : Defined<T>;
export declare type Writeable<T extends Object> = {
    -readonly [Key in keyof T]: T[Key];
};
export declare type Known<T> = T extends {} ? T : undefined;
export declare type Undefined<T> = T | undefined;
export declare type UndefinedZeroOne<T> = T extends Object ? {
    [Key in keyof T]: Undefined<T[Key]>;
} : Undefined<T>;
export declare type UndefinedOne<Tuple extends Object> = {
    [Index in keyof Tuple]: Tuple[Index] | undefined;
};
export declare type UndefinedRecursive<T> = T extends Object ? {
    [Key in keyof T]: UndefinedRecursive<T[Key]>;
} : Undefined<T>;
export declare type NonNullableRecursive<T> = T extends Object ? {
    [Key in keyof T]: NonNullableRecursive<T[Key]>;
} : NonNullable<T>;
export declare type ArrayElements<T extends readonly any[]> = T extends (infer E)[] ? E : never;
export declare type ParseFunction<T> = (raw: string) => T;
export declare const VALID_TYPES: Set<StringConstructor | BooleanConstructor | NumberConstructor>;
export declare type BaseOptionType = StringConstructor | BooleanConstructor | NumberConstructor | ParseFunction<any>;
export declare type OptionType = BaseOptionType | readonly [...BaseOptionType[]] | undefined | unknown;
export declare type RequiredType = true | false | undefined | unknown;
declare type BasePrimitiveType<T extends BaseOptionType> = T extends StringConstructor ? string : T extends BooleanConstructor ? boolean : T extends NumberConstructor ? number : T extends ParseFunction<infer RT> ? RT : never;
declare type BasePrimitiveTuple<Tuple extends readonly [...BaseOptionType[]]> = {
    [Index in keyof Tuple]: BasePrimitiveType<Tuple[Index]>;
};
export declare type PrimitiveType<T extends OptionType> = T extends BaseOptionType ? BasePrimitiveType<T> : T extends (infer E extends BaseOptionType)[] ? BasePrimitiveType<E>[] : T extends readonly [infer E extends BaseOptionType] ? BasePrimitiveType<E>[] : T extends readonly [...BaseOptionType[]] ? BasePrimitiveTuple<T> : never;
declare type MergeTypeWithTuple<Type, Tuple extends readonly [...any[]]> = {
    [Index in keyof Tuple]: Type | Tuple[Index];
};
declare type MergeTupleWithTupleRequired<Tuple1 extends readonly [...any[]], Tuple2 extends readonly [...any[]]> = {
    //@ts-ignore
    [Index in keyof Tuple1]: Tuple1[Index] | Defined<Tuple2[Index]>;
};
declare type MergeTupleWithTupleOptional<Tuple1 extends readonly [...any[]], Tuple2 extends readonly [...any[]]> = {
    //@ts-ignore
    [Index in keyof Tuple1]: Tuple1[Index] | Tuple2[Index];
};
declare type RequiredArray<BOT extends BaseOptionType, DT extends readonly any[]> = DT extends readonly [...any[]] ? [
    ...MergeTypeWithTuple<BasePrimitiveType<BOT>, DefinedOne<DT>>,
    ...BasePrimitiveType<BOT>[]
] : (BasePrimitiveType<BOT> | Defined<ArrayElements<DT>>)[];
declare type OptionalArray<BOT extends BaseOptionType, DT extends readonly any[]> = DT extends readonly [...any[]] ? [
    ...MergeTypeWithTuple<BasePrimitiveType<BOT>, DT>,
    ...(BasePrimitiveType<BOT> | undefined)[]
] : (BasePrimitiveType<BOT> | ArrayElements<DT> | undefined)[];
declare type RequiredTuple<BOTT extends readonly [...BaseOptionType[]], DT extends readonly any[]> = DT extends readonly [...any[]] ? MergeTupleWithTupleRequired<BasePrimitiveTuple<BOTT>, DT> : MergeTypeWithTuple<Defined<ArrayElements<DT>>, BasePrimitiveTuple<BOTT>>;
declare type OptionalTuple<BOTT extends readonly [...BaseOptionType[]], DT extends readonly any[]> = DT extends readonly [...any[]] ? MergeTupleWithTupleOptional<BasePrimitiveTuple<BOTT>, DT> : MergeTypeWithTuple<ArrayElements<DT> | undefined, BasePrimitiveTuple<BOTT>>;
export declare type RequiredOptionPrimitiveResult<OT extends OptionType, DT> = OT extends undefined ? string | Defined<DT> : OT extends BaseOptionType ? BasePrimitiveType<OT> | Defined<DT> : OT extends readonly [infer E extends BaseOptionType] ? DT extends readonly any[] ? RequiredArray<E, DT> : (BasePrimitiveType<E> | Defined<DT>)[] : OT extends (infer E extends BaseOptionType)[] ? DT extends readonly any[] ? RequiredArray<E, DT> : (BasePrimitiveType<E> | Defined<DT>)[] : OT extends readonly [...BaseOptionType[]] ? DT extends readonly any[] ? RequiredTuple<Writeable<OT>, DT> : MergeTypeWithTuple<Defined<DT>, BasePrimitiveTuple<Writeable<OT>>> : never;
export declare type OptionalOptionPrimitiveResult<OT extends OptionType, DT> = OT extends undefined ? string | DT : OT extends BaseOptionType ? BasePrimitiveType<OT> | DT : OT extends readonly [infer E extends BaseOptionType] ? DT extends readonly any[] ? OptionalArray<E, DT> : (BasePrimitiveType<E> | DT)[] | undefined : OT extends (infer E extends BaseOptionType)[] ? DT extends readonly any[] ? OptionalArray<E, DT> : (BasePrimitiveType<E> | DT)[] | undefined : OT extends readonly [...BaseOptionType[]] ? DT extends readonly any[] ? OptionalTuple<Writeable<OT>, DT> : MergeTypeWithTuple<DT, BasePrimitiveTuple<Writeable<OT>>> | undefined : never;
export declare type OptionPrimitiveResult<OT extends OptionType, DT, Required extends RequiredType> = Required extends true ? RequiredOptionPrimitiveResult<OT, DT> : OptionalOptionPrimitiveResult<OT, DT>;
export interface BaseInputOption<OT extends OptionType, DT, RT extends RequiredType> {
    input: string | readonly string[];
    type?: OT;
    required?: RT;
    default?: DT;
}
export interface RequiredInputOption<OT extends OptionType, DT> extends BaseInputOption<OT, DT, true> {
    required: true;
}
export interface OptionalInputOption<OT extends OptionType, DT> extends BaseInputOption<OT, DT, false> {
    required?: false;
}
export declare type InputOption<OT extends OptionType, DT, RT extends RequiredType> = RequiredInputOption<OT, DT> | OptionalInputOption<OT, DT>;
export interface BaseInputsOption<OT extends OptionType, DT, RT extends RequiredType> {
    input?: string | readonly string[];
    type?: OT;
    required?: RT;
    default?: DT;
}
export interface RequiredInputsOption<OT extends OptionType, DT> extends BaseInputsOption<OT, DT, true> {
    required: true;
}
export interface OptionalInputsOption<OT extends OptionType, DT> extends BaseInputsOption<OT, DT, false> {
    required?: false;
}
export declare type InputsOption<OT extends OptionType, DT, RT extends RequiredType> = RequiredInputsOption<OT, DT> | OptionalInputsOption<OT, DT>;
export { };
