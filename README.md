<div align="center">
  
# Github Action Input Parser

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/pdamianik/github-action-input-parser/blob/master/LICENSE)

Helper for parsing inputs in a GitHub Action

</div>

## ⭐ Features

- Parses [string, booleans, numbers and arrays](#types) to correct JS types
- Supports [default values](#default-values) if no input was provided
- Throws errors if input is set to [required](#required-inputs) and is missing
- Uses local environment variables and `.env` files during [development](#development)
- Specify a [custom function](#types) for advanced parsing
- Supports [array of inputs](#input)
- Supports [Typescript](#typescript)
- Supports parsing [multiple inputs](#getInputs)

## 🚀 Get started

Install [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) via npm:

```shell
npm install github-action-input-parser
```

## 📚 Usage

Import `github-action-input-parser` and use it like this:

Javascript:

```js
const parser = require('github-action-input-parser');
```

JS Modules/Typescript:

```js
import * as parser from 'github-action-input-parser';
```

### Example

Let's say you have the following workflow file (see [below](#development) on how to specify inputs during development):

```yml
uses: username/action
with:
    names: |
        Maximilian
        Richard
```

Pass an options object to the `getInput` function to specify an array of `String` type:

```ts
const value = parser.getInput({
    input: 'names',
    type: <const>[String],
});

// [ 'Maximilian', 'Richard' ]
```

[github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will parse the `names` input and return an array.

See below for [all options](#all-options) or checkout a few more [examples](#-examples).

## ⚙️ Configuration

You can pass the following object to `getInput` to tell [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) what to parse:

```ts
const options = {
    input: 'names',
    type: <const>[String],
    default: <const>['maximilian'],
};

parser.getInput(options);

```

### All options

Here are all the options you can use and there default values:

| Name | Description | Required | Default | See more |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `input` | The input name (can also be an array of inputs) | **Yes** | N/A | [Input](#input) |
| `type` | The type of the input value | **No** | `String` | [Types](#types) |
| `required` | Specify if the input is required | **No** | false | [Required Inputs](#required-inputs) |
| `default` | Specify a default value for the input | **No** | undefined | [Default Values](#default-values) |

### Input

You can either specify a single input as a string, or multiple inputs as an array of strings. This options declares which input(s) should be parsed. When using an array of inputs the first input defined will be picked for parsing.

> Note: Even when the chosen input can not be parsed for the given type, [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will not try another input and instead throw an error

[See example](#pick-from-multiple-inputs)

### Types

You can specify one of the following basic types (BaseTypes) which will determine how the input is parsed:

- `String` - Default type, the input value will only be trimmed
- `Boolean` - Will parse a boolean based on the [yaml 1.2 specification](https://yaml.org/spec/1.2/spec.html#id2804923)
- `Number` - Will convert the input to a number
- `(value: string) => any` / `Function` - Will call the function specified to parse an input. Use this for custom types

> Note: `String`, `Boolean` and `Number` are literals of type `StringConstructor`, `BooleanConstructor` and `NumberConstructor` respectively

> Note: if the input can not be converted to the specifed type, an error is thrown

Additionally you can specifiy an array with the 4 BaseTypes as elements. When using typescript it is recommended to prefix the array with `<const>` or suffix it with `as const` for optimal type-hinting. The meaning of the array type depends on the amount of its elements:

 - 0 elements - not allowed, [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will throw an error
 - 1 element - [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will treat this type as an __Array Type__ and tries parsing the input for any number of elements separated by a comma or a newline using the parser specified by the BaseType inside the type array
 - 2+ elements - [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will treat this type as a __Tuple Type__ and tries parsing the input for as many elements separated by a comma or a newline as the number of elements in the type array. The parser used depends on the type at the equivalent index in the type array

[See example](#specify-a-type)

### Required inputs

When you set required to true and the input(s) are not set or could not be parsed, [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will throw an error. When using an array type [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will check each element of the resulting array and if any of them could not be parsed [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will throw an error.

[See example](#set-an-input-to-be-required)

### Default values

You can specify a default value for the input which will be used when the input is not set. How this default value will be used depends on its type and the [type](#types) of the parsed content:

| `type` option | default value type | behavior |
| ------------- | ------------- | ------------- |
| BaseTypes | any | The default value replaces the parsed value if the parsed value is `undefined` |
| ArrayType or TupleType | any non-array | The default value replaces any `undefined` elements of the parsed array. However the default value will not replace the parsed value itself if it ends up being `undefined` (e.g. when the input is not set) |
| ArrayType or TupleType | any array | The elements of the default value replace any `undefined` element at the same index in the parsed array. If the parsed array is longer than the default value array this can result in `undefined` elements beyond the length of the default value array. The default value array __will__ replace the parsed array if it is `undefined`

[See example](#specify-a-default-value)

### Development

If you run your Action locally during development, you can set the inputs as environment variables or specify them in a `.env` file. [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser) will use them as the inputs automatically.

## Typescript

This library has Typescript support but to get the most out of it you have to prefix any array passed to the configuration options [type](#types) and [default](#default-values) with `<const>` or suffix them with `as const`.

[See example](#specify-a-type)

## `getInputs`

To parse multiple inputs with different configurations into one options you can use the `getInputs()` function. It takes an object where each element is either an argument for `getInput()` (`string | string[] | Options`) or `undefined`. When an element is `undefined` the key will be used as the input name.

[See example](#parse-multiple-inputs)

## 📖 Examples

Here are some examples on how to use [github-action-input-parser](https://github.com/pdamianik/github-action-input-parser):

See [README.test.ts](https://github.com/pdamianik/github-action-input-parser/blob/master/test/README.test.ts)

### Basic example

Action Workflow:

```yml
uses: username/action
with:
    name: Maximilian
```

Action code:

```js
const value = parser.getInput('name');

// value -> Maximilian
```

or 

```js
const value = parser.getInput({
    input: 'name',
});

// value -> Maximilian
```

### Specify a type

Action Workflow:

```yml
uses: username/action
with:
    dry_run: true
```

Action code:

```js
const value = parser.getInput({ 
    input: 'dry_run',
    type: Boolean,
});

// Without setting the type to boolean, the value would have been 'true'
```

Action Workflow:

```yml
uses: username/action
with:
    stages: |
        'dev'
        'prod'
```

Action code:

```ts
const value = parser.getInput({ 
    input: 'stages',
    type: <const>[String],
});

// ['dev', 'prod']
```

Action Workflow:

```yml
uses: username/action
with:
    fruits: |
        10
        apples
```

Action code:

```ts
const value = parser.getInput({ 
    input: 'fruits',
    type: <const>[Number, String],
});

// [10, 'apples']
```

### Specify a default value

Action Workflow:

```yml
uses: username/action
with:
```

Action code:

```js
const value = parser.getInput({ 
    input: 'name',
    default: 'Maximilian',
});

// As name is not set, Maximilian will be returned as the name
```

Action Workflow:

```yml
uses: username/action
with:
    command: |
        bring me

        apples
```

Action code:

```ts
const value = parser.getInput({ 
    input: 'command',
    type: <const>[String, Number, String],
    default: <const>[undefined, 10],
});

// ['bring me', 10, 'apples']
```

### Set an input to be required

Action Workflow:

```yml
uses: username/action
with:
```

Action code:

```js
const value = parser.getInput({
    input: 'name',
    required: true,
});

// Will throw an error if name is not set
```

### Pick from multiple inputs

Action Workflow:

```yml
uses: username/action
with:
    GH_PAT: 'abcdefghijklmnopqrstuvwxyz';
```

Action code:

```js
const value = parser.getInput({ 
    input: [ 'GITHUB_TOKEN', 'GH_PAT' ]
});

// The first input available takes precedence -> GH_PATs value will be parsed
```

### Parse multiple inputs

Action code:

Javascript:

```yml
uses: username/action
with:
    greeting: 'Hello world!'
    GH_PAT: 'abcdefghijklmnopqrstuvwxyz'
```

```js
const {value1, value2, value3} = parser.getInputs({
    value1: 'greeting',
    value2: {
        input: [ 'GITHUB_TOKEN', 'GH_PAT' ],
        required: true,
    },
    value3: {
        input: 'max retires',
        type: Number,
        default: 3,
    },
});

// value1 = 'Hello world!', value2 = 'abcdefghijklmnopqrstuvwxyz', value3 = 3
```

### Advanced example

Action Workflow:

```yml
uses: username/action
with:
    github_token: TOKEN
    repository: username/reponame
    labels: |
        merged
        ready
```

Action code:

```ts
const config = getInputs({
    githubToken: {
        input: 'github_token',
        required: true,
    },
    repository: {
        input: 'repository',
        type: (val) => {
            const [user, repo] = val.split('/')
            return { user, repo }
        },
    },
    labels: {
        input: 'labels',
        type: <const>[String],
    },
    dryRun: {
        input: 'dry_run',
        type: Boolean,
        default: false,
    },
});

// parsed config:
{
    githubToken: 'TOKEN',
    repository: {
        name: 'username',
        repo: 'reponame'
    },
    labels: [ 'merged', 'ready' ],
    dryRun: false,
}
```

## 📖 Extended Examples

See [index.test.ts](https://github.com/pdamianik/github-action-input-parser/blob/master/src/index.test.ts)

## 💻 Development

Issues and PRs are very welcome!

The actual source code of this library is in the `src` folder.

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn build` or `npm run build` to produce a compiled version in the `lib` folder.

## ❔ About

This project was originally developed by ([@betahuhn](https://github.com/BetaHuhn)) and was heavily modified by ([@pdamianik](https://github.com/pdamianik/)) in their free time. If you want to support [@betahuhn](https://github.com/BetaHuhn):

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F81S2RK)

## 📄 License

Copyright 2021 Maximilian Schiller<br>
Copyright 2022 Philip Damianik

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
