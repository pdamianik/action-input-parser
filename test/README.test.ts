import * as parser from "../src";

describe('README tests', () => {
	const ENV = { ...process.env };

	beforeEach(() => {
		process.env = { ...ENV };
	});

	afterEach(() => {
		process.env = ENV;
	});

	it('Example', () => {
		process.env.INPUT_NAMES = 'Maximilian\nRichard';

		const value = parser.getInput({
			input: 'names',
			type: <const>[String],
		});
		const check: TypeCheck<typeof value, (undefined | string)[] | undefined> = value;
		expect(value).toEqual(['Maximilian', 'Richard']);
	});

	it('Configuration', () => {
		process.env.INPUT_NAMES = '\nRichard';

		const value = parser.getInput({
			input: 'names',
			type: <const>[String],
			default: <const>['maximilian'],
		});
		const check: TypeCheck<typeof value, [string, ...(undefined | string)[]]> = value;
		expect(value).toEqual(['maximilian', 'Richard']);
	});

	it('Basic Example', () => {
		process.env.INPUT_NAME = 'Maximilian';

		const value1 = parser.getInput('name');
		const check1: TypeCheck<typeof value1, string | undefined> = value1;

		const value2 = parser.getInput({
			input: 'name',
		});
		const check2: TypeCheck<typeof value2, string | undefined> = value2;

		expect(value1).toEqual('Maximilian');
		expect(value2).toEqual(value1);
	});

	describe('Specifiy a type', () => {

		it('simple boolean', () => {
			process.env.INPUT_DRY_RUN = 'true';

			const value = parser.getInput({
				input: 'dry_run',
				type: Boolean,
			});
			const check: TypeCheck<typeof value, boolean | undefined> = value;

			expect(value).toEqual(true);
		});

		it('string array', () => {
			process.env.INPUT_STAGES = 'dev\nprod';

			const value = parser.getInput({
				input: 'stages',
				type: <const>[String],
			});
			const check: TypeCheck<typeof value, (string | undefined)[] | undefined> = value;

			expect(value).toEqual(['dev', 'prod']);
		});

		it('number string tuple', () => {
			process.env.INPUT_FRUITS = '10\napples';

			const value = parser.getInput({
				input: 'fruits',
				type: <const>[Number, String],
			});
			const check: TypeCheck<typeof value, [number | undefined, string | undefined] | undefined> = value;

			expect(value).toEqual([10, 'apples']);
		});

	});

	describe('Specify a default value', () => {

		it('string with default value', () => {
			const value = parser.getInput({
				input: 'name',
				default: 'Maximilian',
			});
			const check: TypeCheck<typeof value, string> = value;

			expect(value).toEqual('Maximilian');
		});

		it('number string tuple', () => {
			process.env.INPUT_COMMAND = 'bring me\n\napples';

			const value = parser.getInput({
				input: 'command',
				type: <const>[String, Number, String],
				default: <const>[undefined, 10],
			});
			const check: TypeCheck<typeof value, [string | undefined, number, string | undefined]> = value;

			expect(value).toEqual(['bring me', 10, 'apples']);
		});

	});

	it('Set an input to be required', () => {
		expect(() => {
			const value = parser.getInput({
				input: 'name',
				required: true,
			});
		}).toThrow('input `name` is required but was not provided');
	});

	it('Pick from multiple inputs', () => {
		process.env.INPUT_GH_PAT = 'abcdefghijklmnopqrstuvwxyz';

		const value = parser.getInput({
			input: ['GITHUB_TOKEN', 'GH_PAT']
		});
		const check: TypeCheck<typeof value, string | undefined> = value;

		expect(value).toEqual('abcdefghijklmnopqrstuvwxyz');
	});

	it('Pick from multiple inputs', () => {
		process.env.INPUT_GREETING = 'Hello world!';
		process.env.INPUT_GH_PAT = 'abcdefghijklmnopqrstuvwxyz';

		const { value1, value2, value3 } = parser.getInputs({
			value1: 'greeting',
			value2: {
				input: ['GITHUB_TOKEN', 'GH_PAT'],
				required: true,
			},
			value3: {
				input: 'max retires',
				type: Number,
				default: 3,
			},
		});
		const check1: TypeCheck<typeof value1, string | undefined> = value1;
		const check2: TypeCheck<typeof value2, string> = value2;
		const check3: TypeCheck<typeof value3, number> = value3;

		expect(value1).toEqual('Hello world!');
		expect(value2).toEqual('abcdefghijklmnopqrstuvwxyz');
		expect(value3).toEqual(3);
	});

	it('Advanced example', () => {
		process.env.INPUT_GITHUB_TOKEN = 'TOKEN';
		process.env.INPUT_REPOSITORY = 'username/reponame';
		process.env.INPUT_LABELS = 'merged\nready';

		const config = parser.getInputs({
			githubToken: {
				input: 'github_token',
				required: true,
			},
			repository: {
				input: 'repository',
				type: (val: string) => {
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
		const check: TypeCheck<typeof config, { githubToken: string, repository: { user: string, repo: string } | undefined, labels: (string | undefined)[] | undefined, dryRun: boolean }> = config;

		expect(config).toEqual({
			githubToken: 'TOKEN',
			repository: { user: 'username', repo: 'reponame' },
			labels: ['merged', 'ready'],
			dryRun: false,
		});
	});

});