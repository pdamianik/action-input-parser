declare type ModifierFunction<T extends OptionType> = (val: PrimitiveType<T> | undefined) => PrimitiveType<T>;
export declare type BaseOptionType = StringConstructor | BooleanConstructor | NumberConstructor;
export declare type OptionType = BaseOptionType | readonly [...BaseOptionType[]];
export declare const VALID_TYPES: Set<StringConstructor | BooleanConstructor | NumberConstructor>;
declare type BasePrimitiveType<T extends BaseOptionType> = T extends StringConstructor ? string : T extends BooleanConstructor ? boolean : T extends NumberConstructor ? number : never;
declare type BasePrimitiveTypeTuple<Tuple extends readonly [...BaseOptionType[]]> = {
    [Index in keyof Tuple]: BasePrimitiveType<Tuple[Index]>;
};
export declare type PrimitiveType<T extends OptionType> = T extends BaseOptionType ? BasePrimitiveType<T> : T extends (infer E extends BaseOptionType)[] ? BasePrimitiveType<E>[] : T extends readonly [infer E extends BaseOptionType] ? BasePrimitiveType<E>[] : T extends readonly [...BaseOptionType[]] ? BasePrimitiveTypeTuple<T> : never;
export declare type UndefinedPrimitiveType<T extends OptionType> = T extends BaseOptionType ? BasePrimitiveType<T> | undefined : T extends (infer E extends BaseOptionType)[] ? (BasePrimitiveType<E> | undefined)[] | undefined : T extends readonly [(infer E extends BaseOptionType)] ? (BasePrimitiveType<E> | undefined)[] | undefined : T extends readonly [...BaseOptionType[]] ? UndefinedTuple<T> | undefined : never;
declare type TupleWithDefinedRest<RestType extends BaseOptionType, DefaultType extends BasePrimitiveType<RestType>[] | readonly [...BasePrimitiveType<RestType>[]]> = DefaultType extends readonly [...any[]] ? [
    ...MergeOptionAndDefaultType<RestType, DefaultType>,
    ...BasePrimitiveType<RestType>[]
] : BasePrimitiveType<RestType>[];
export declare type RequiredDefaultPrimitiveType<T extends OptionType, DT extends DefaultType<T>> = T extends BaseOptionType ? BasePrimitiveType<T> : T extends readonly [infer BT extends BaseOptionType] ? DT extends readonly [...BasePrimitiveType<BT>[]] ? TupleWithDefinedRest<BT, DT> : never : T extends (infer BT extends BaseOptionType)[] ? DT extends readonly [...BasePrimitiveType<BT>[]] ? TupleWithDefinedRest<BT, DT> : never : T extends readonly [...BaseOptionType[]] ? BasePrimitiveTypeTuple<T> : never;
declare type TupleWithUndefinedRest<RestType extends BaseOptionType, DefaultType extends BasePrimitiveType<RestType>[] | readonly [...BasePrimitiveType<RestType>[]]> = DefaultType extends readonly [...any[]] ? [
    ...MergeOptionAndDefaultType<RestType, DefaultType>,
    ...(BasePrimitiveType<RestType> | undefined)[]
] : (BasePrimitiveType<RestType> | undefined)[];
declare type UndefinedTuple<Tuple extends readonly [...BaseOptionType[]]> = {
    [Index in keyof Tuple]: BasePrimitiveType<Tuple[Index]> | undefined;
};
declare type MergeOptionAndDefaultType<T extends BaseOptionType, DT extends DefaultType<T>> = {
    [Index in keyof DT]: BasePrimitiveType<T> | DT[Index];
};
export declare type OptionalDefaultPrimitiveType<T extends OptionType, DT extends DefaultType<T>> = T extends BaseOptionType ? BasePrimitiveType<T> : T extends readonly [infer BT extends BaseOptionType] ? DT extends readonly [...BasePrimitiveType<BT>[]] ? TupleWithUndefinedRest<BT, DT> : never : T extends (infer BT extends BaseOptionType)[] ? DT extends readonly [...BasePrimitiveType<BT>[]] ? TupleWithUndefinedRest<BT, DT> : never : T extends readonly [...BaseOptionType[]] ? BasePrimitiveTypeTuple<T> : never;
export declare type DefaultTuple<T extends readonly [...BaseOptionType[]]> = {
    readonly [Key in keyof T]: BasePrimitiveType<T[Key]>;
};
export declare type DefaultType<T extends OptionType> = T extends BaseOptionType ? BasePrimitiveType<T> : T extends (infer E extends BaseOptionType)[] ? readonly [...BasePrimitiveType<E>[]] : T extends readonly [infer E extends BaseOptionType] ? readonly [...BasePrimitiveType<E>[]] : T extends readonly [...BaseOptionType[]] ? DefaultTuple<T> : never;
interface BaseOptions<T extends OptionType> {
    key: string | Array<string>;
    type?: T;
    required?: boolean;
    default?: DefaultType<T>;
    modifier?: ModifierFunction<T>;
}
export interface RequiredOptions<T extends OptionType> extends BaseOptions<T> {
    type: T;
    required: true;
    default?: undefined;
}
export interface OptionalOptions<T extends OptionType> extends BaseOptions<T> {
    type: T;
    required?: false;
    default?: undefined;
}
export interface RequiredOptionsWithDefault<T extends OptionType, DT extends DefaultType<T>> extends BaseOptions<T> {
    type: T;
    required: true;
    default: DT;
}
export interface OptionalOptionsWithDefault<T extends OptionType, DT extends DefaultType<T>> extends BaseOptions<T> {
    type: T;
    required?: false;
    default: DT;
}
export interface RequiredOptionsWithoutType extends BaseOptions<StringConstructor> {
    type?: undefined;
    required: true;
}
export interface OptionalOptionsWithoutType extends BaseOptions<StringConstructor> {
    type?: undefined;
    required?: false;
    default?: undefined;
}
export interface OptionalOptionsWithoutTypeWithDefault extends BaseOptions<StringConstructor> {
    type?: undefined;
    required?: false;
    default: string;
}
export declare type Options<T extends OptionType> = RequiredOptions<T> | OptionalOptions<T> | RequiredOptionsWithDefault<T, PrimitiveType<T>> | OptionalOptionsWithDefault<T, PrimitiveType<T>> | RequiredOptionsWithoutType | OptionalOptionsWithoutType | OptionalOptionsWithoutTypeWithDefault;
export interface ParsedOpts<T extends OptionType> extends BaseOptions<T> {
    required: boolean;
}
export {};
