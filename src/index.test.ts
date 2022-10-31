import { getInput, getInputs } from ".";

describe('get input', () => {
	const ENV = {
		...process.env,
		INPUT_ABC: 'abc',
		INPUT_DEF: 'def',
		INPUT_GHI: 'ghi',
		INPUT_TRUE: 'true',
		INPUT_FALSE: 'FALSE',
		INPUT_ZERO: '0',
		INPUT_ALPHA: 'a,b,c',
		INPUT_BETA: 'a,b,c,',
		INPUT_GAMMA: 'a\nb\nc',
		INPUT_DELTA: 'a\nb\nc\n',
		INPUT_EPSILON: 'a,\nb,\nc',
		INPUT_ZETA: 'a,\nb,\nc,\n',
		INPUT_ETA: 'true,false,true,false',
		INPUT_THETA: 'a,0,true',
		INPUT_PARTIAL: 'a,,c',
		INPUT_EMPTY: '',
	};

	beforeEach(() => {
		process.env = { ...ENV };
	});

	afterEach(() => {
		process.env = ENV;
	});

	describe('single', () => {

		it('existent', () => {
			const input = getInput('abc');
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual('abc');
		});

		it('empty', () => {
			const input = getInput('empty');
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual('');
		});

		it('non-existent', () => {
			const input = getInput('xyz');
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual(undefined);
		});

	});


	describe('multiple', () => {

		it('non-existing, non-existing', () => {
			const input = getInput(['uvw', 'xyz']);
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual(undefined);
		});

		it('existing, non-existing', () => {
			const input = getInput(['def', 'xyz']);
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual('def');
		});

		it('non-existing, existing', () => {
			const input = getInput(['xyz', 'def']);
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual('def');
		});

		it('existing, existing', () => {
			const input = getInput(['def', 'abc']);
			const check: TypeCheck<typeof input, string | undefined> = input;
			expect(input).toEqual('def');
		});

	});

	describe('with options', () => {

		describe('key', () => {

			describe('single', () => {

				it('existent', () => {
					const input = getInput({ input: 'abc' });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ input: 'empty' });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					const input = getInput({ input: 'xyz' });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual(undefined);
				});

			});

			describe('multiple', () => {

				it('non-existing, non-existing', () => {
					const input = getInput({ input: ['uvw', 'xyz'] });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('existing, non-existing', () => {
					const input = getInput({ input: ['def', 'xyz'] });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('def');
				});

				it('non-existing, existing', () => {
					const input = getInput({ input: ['def', 'abc'] });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('def');
				});

				it('existing, existing', () => {
					const input = getInput({ input: ['def', 'abc'] });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('def');
				});

			});

		});

		describe('type', () => {

			describe('string', () => {

				it('valid', () => {
					const input = getInput({ input: 'abc', type: String });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: String });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					const input = getInput({ input: 'xyz', type: String });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual(undefined);
				});

			});

			describe('boolean', () => {

				it('valid', () => {
					const input = getInput({ input: 'true', type: Boolean });
					const check: TypeCheck<typeof input, boolean | undefined> = input;
					expect(input).toEqual(true);
				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: Boolean });
					const check: TypeCheck<typeof input, boolean | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('non-existent', () => {
					const input = getInput({ input: 'xyz', type: Boolean });
					const check: TypeCheck<typeof input, boolean | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('invalid', () => {
					expect(() => {
						const input = getInput({ input: 'abc', type: Boolean });
						const check: TypeCheck<typeof input, boolean | undefined> = input;
					}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
				});

			});

			describe('number', () => {

				it('valid', () => {
					const input = getInput({ input: 'zero', type: Number });
					const check: TypeCheck<typeof input, number | undefined> = input;
					expect(input).toEqual(0);
				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: Number });
					const check: TypeCheck<typeof input, number | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('non-existent', () => {
					const input = getInput({ input: 'xyz', type: Number });
					const check: TypeCheck<typeof input, number | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('invalid', () => {
					expect(() => {
						const input = getInput({ input: 'abc', type: Number });
						const check: TypeCheck<typeof input, number | undefined> = input;
					}).toThrow('input has to be a valid number');
				});

			});

			describe('function', () => {

				it('valid', () => {
					const input = getInput({ input: 'abc', type: (val: string) => val });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: (val: string) => val });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual(undefined);
				});

				it('non-existent', () => {
					const input = getInput({ input: 'xyz', type: (val: string) => val });
					const check: TypeCheck<typeof input, string | undefined> = input;
					expect(input).toEqual(undefined);
				});

			});

			describe('multi element', () => {

				describe('sepatrated by', () => {

					it('nothing (single element)', () => {
						const input = getInput({ input: 'abc', type: <const>[String] });
						const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
						expect(input).toEqual(['abc']);
					});

					describe('comma', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'alpha', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'beta', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('newline', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'gamma', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'delta', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('mixed', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'epsilon', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'zeta', type: <const>[String] });
							const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});
				});
				describe('typing', () => {

					it('array', () => {
						const input = getInput({ input: 'eta', type: <const>[Boolean] });
						const check: TypeCheck<typeof input, (boolean | undefined)[] | undefined> = input;
						expect(input).toEqual([true, false, true, false]);
					});

					describe('tuple', () => {

						describe('single type', () => {

							it('shorter', () => {
								const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean] });
								const check: TypeCheck<typeof input, [boolean | undefined, boolean | undefined, boolean | undefined] | undefined> = input;
								expect(input).toEqual([true, false, true]);
							});

							it('same length', () => {
								const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean] });
								const check: TypeCheck<typeof input, [boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined] | undefined> = input;
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean] });
								const check: TypeCheck<typeof input, [boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined] | undefined> = input;
								expect(input).toEqual([true, false, true, false, undefined]);
							});

						});

						describe('multiple types', () => {

							it('shorter', () => {
								const input = getInput({ input: 'theta', type: <const>[String, Number] });
								const check: TypeCheck<typeof input, [string | undefined, number | undefined] | undefined> = input;
								expect(input).toEqual(['a', 0]);
							});

							it('same length', () => {
								const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean] });
								const check: TypeCheck<typeof input, [string | undefined, number | undefined, boolean | undefined] | undefined> = input;
								expect(input).toEqual(['a', 0, true]);
							});

							it('longer', () => {
								const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val] });
								const check: TypeCheck<typeof input, [string | undefined, number | undefined, boolean | undefined, string | undefined] | undefined> = input;
								expect(input).toEqual(['a', 0, true, undefined]);
							});

						});

						it('partial', () => {
							const input = getInput({ input: 'partial', type: <const>[String, Boolean, String] });
							const check: TypeCheck<typeof input, [string | undefined, boolean | undefined, string | undefined] | undefined> = input;
							expect(input).toEqual(['a', undefined, 'c']);
						});

					});

				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: <const>[String] });
					const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
					expect(input).toEqual([]);
				});

				it('non existent', () => {
					const input = getInput({ input: 'xyz', type: <const>[String] });
					const check: TypeCheck<typeof input, (string | undefined)[] | undefined> = input;
					expect(input).toEqual(undefined);
				});

			});

		});

		describe('required', () => {

			describe('string', () => {

				it('existent', () => {
					const input = getInput({ input: 'abc', type: String, required: true });
					const check: TypeCheck<typeof input, string> = input;
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: String, required: true });
					const check: TypeCheck<typeof input, string> = input;
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					expect(() => {
						const input = getInput({ input: 'xyz', type: String, required: true });
						const check: TypeCheck<typeof input, string> = input;
					}).toThrow('input `xyz` is required but was not provided');
				});

			});

			describe('boolean', () => {

				it('existent', () => {
					const input = getInput({ input: 'true', type: Boolean, required: true });
					const check: TypeCheck<typeof input, boolean> = input;
					expect(input).toEqual(true);
				});

				it('empty', () => {
					expect(() => {
						const input = getInput({ input: 'empty', type: Boolean, required: true });
						const check: TypeCheck<typeof input, boolean> = input;
					}).toThrow('input `empty` is required but empty');
				});

				it('non-existent', () => {
					expect(() => {
						const input = getInput({ input: 'xyz', type: Boolean, required: true });
						const check: TypeCheck<typeof input, boolean> = input;
					}).toThrow('input `xyz` is required but was not provided');
				});

				it('invalid', () => {
					expect(() => {
						const input = getInput({ input: 'abc', type: Boolean, required: true });
						const check: TypeCheck<typeof input, boolean> = input;
					}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
				});

			});

			describe('number', () => {

				it('existent', () => {
					const input = getInput({ input: 'zero', type: Number, required: true });
					const check: TypeCheck<typeof input, number> = input;
					expect(input).toEqual(0);
				});

				it('empty', () => {
					expect(() => {
						const input = getInput({ input: 'empty', type: Number, required: true });
						const check: TypeCheck<typeof input, number> = input;
					}).toThrow('input `empty` is required but empty');
				});

				it('non-existent', () => {
					expect(() => {
						const input = getInput({ input: 'xyz', type: Number, required: true });
						const check: TypeCheck<typeof input, number> = input;
					}).toThrow('input `xyz` is required but was not provided');
				});

				it('invalid', () => {
					expect(() => {
						const input = getInput({ input: 'abc', type: Number, required: true });
						const check: TypeCheck<typeof input, number> = input;
					}).toThrow('input has to be a valid number');
				});

			});

			describe('function', () => {

				it('existent', () => {
					const input = getInput({ input: 'abc', type: (val: string) => val, required: true });
					const check: TypeCheck<typeof input, string> = input;
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					expect(() => {
						const input = getInput({ input: 'empty', type: (val: string) => val, required: true });
						const check: TypeCheck<typeof input, string> = input;
					}).toThrow('input `empty` is required but empty');
				});

				it('non-existent', () => {
					expect(() => {
						const input = getInput({ input: 'xyz', type: (val: string) => val, required: true });
						const check: TypeCheck<typeof input, string> = input;
					}).toThrow('input `xyz` is required but was not provided');
				});

			});

			describe('multi element', () => {

				describe('sepatrated by', () => {

					it('nothing (single element)', () => {
						const input = getInput({ input: 'abc', type: <const>[String], required: true });
						const check: TypeCheck<typeof input, string[]> = input;
						expect(input).toEqual(['abc']);
					});

					describe('comma', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'alpha', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'beta', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('newline', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'gamma', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'delta', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('both', () => {

						it('not trailing', () => {
							const input = getInput({ input: 'epsilon', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ input: 'zeta', type: <const>[String], required: true });
							const check: TypeCheck<typeof input, string[]> = input;
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});
				});

				describe('typing', () => {

					it('array', () => {
						const input = getInput({ input: 'eta', type: <const>[Boolean], required: true });
						const check: TypeCheck<typeof input, boolean[]> = input;
						expect(input).toEqual([true, false, true, false]);
					});

					describe('tuple', () => {

						describe('single type', () => {

							it('shorter', () => {
								const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true });
								const check: TypeCheck<typeof input, [boolean, boolean, boolean]> = input;
								expect(input).toEqual([true, false, true]);
							});

							it('same length', () => {
								const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true });
								const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								expect(() => {
									const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean]> = input;
								}).toThrow('input array `eta` contains elements that could not be parsed')
							});

						});

						describe('multiple types', () => {

							it('shorter', () => {
								const input = getInput({ input: 'theta', type: <const>[String, Number], required: true });
								const check: TypeCheck<typeof input, [string, number]> = input;
								expect(input).toEqual(['a', 0]);
							});

							it('same length', () => {
								const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true });
								const check: TypeCheck<typeof input, [string, number, boolean]> = input;
								expect(input).toEqual(['a', 0, true]);
							});

							it('longer', () => {
								expect(() => {
									const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true });
									const check: TypeCheck<typeof input, [string, number, boolean, string]> = input;
								}).toThrow('input array `theta` contains elements that could not be parsed');
							});

						});

						it('partial', () => {
							expect(() => {
								const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true });
								const check: TypeCheck<typeof input, [string, boolean, string]> = input;
							}).toThrow('input array `partial` contains elements that could not be parsed');
						});

					});

				});

				it('empty', () => {
					const input = getInput({ input: 'empty', type: [String], required: true });
					const check: TypeCheck<typeof input, string[]> = input;
					expect(input).toEqual([]);
				});

				it('non existent', () => {
					expect(() => {
						const input = getInput({ input: 'xyz', type: [String], required: true });
						const check: TypeCheck<typeof input, string[]> = input;
					}).toThrow('input `xyz` is required but was not provided');
				});

			});

		});

		describe('default', () => {

			describe('same type', () => {

				describe('optional', () => {

					describe('string', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: String, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: String, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: String, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

					});

					describe('boolean', () => {

						it('existent', () => {
							const input = getInput({ input: 'true', type: Boolean, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(true);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Boolean, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(false);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Boolean, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(false);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Boolean, default: false });
								const check: TypeCheck<typeof input, boolean> = input;
							}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
						});

					});

					describe('number', () => {

						it('existent', () => {
							const input = getInput({ input: 'zero', type: Number, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(0);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Number, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(1);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Number, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(1);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Number, default: 1 });
								const check: TypeCheck<typeof input, number> = input;
							}).toThrow('input has to be a valid number');
						});

					});

					describe('function', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: (val: string) => val, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: (val: string) => val, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: (val: string) => val, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

					});

					describe('multi element', () => {

						describe('sepatrated by', () => {

							it('nothing (single element)', () => {
								const input = getInput({ input: 'abc', type: <const>[String], default: <const>['xyz'] });
								const check: TypeCheck<typeof input, [string, ...(string | undefined)[]]> = input;
								expect(input).toEqual(['abc']);
							});

							describe('comma', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'alpha', type: <const>[String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'beta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

							});

							describe('newline', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'gamma', type: [String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'delta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

							});

							describe('mixed', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'epsilon', type: [String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'zeta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, string, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['a', 'b', 'c', 'z']);
								});

							});
						});
						describe('typing', () => {

							describe('array', () => {

								it('shorter', () => {
									const input = getInput({ input: 'eta', type: [Boolean], default: <const>[false, true, false] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, ...(boolean | undefined)[]]> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								it('same length', () => {
									const input = getInput({ input: 'eta', type: [Boolean], default: <const>[false, true, false, true] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, ...(boolean | undefined)[]]> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								it('longer', () => {
									const input = getInput({ input: 'eta', type: [Boolean], default: <const>[false, true, false, true, false] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean, ...(boolean | undefined)[]]> = input;
									expect(input).toEqual([true, false, true, false, false]);
								});

							});

							describe('tuple', () => {

								describe('single type', () => {

									it('shorter type', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], default: [false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true]);
									});

									it('shorter default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean | undefined]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('shorter type and default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], default: <const>[false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true]);
									});

									it('same length', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer type', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: <const>[false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean | undefined]> = input;
										expect(input).toEqual([true, false, true, false, undefined]);
									});

									it('longer default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[false, true, false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer type and default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: [false, true, false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false, false]);
									});

								});

								describe('multiple types', () => {

									it('shorter type', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number], default: <const>['b', 1, false] });
										const check: TypeCheck<typeof input, [string, number]> = input;
										expect(input).toEqual(['a', 0]);
									});

									it('shorter default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>['b', 1] });
										const check: TypeCheck<typeof input, [string, number, boolean | undefined]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('shorter type and default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number], default: <const>['b', 1] });
										const check: TypeCheck<typeof input, [string, number]> = input;
										expect(input).toEqual(['a', 0]);
									});

									it('same length', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>['b', 1, false] });
										const check: TypeCheck<typeof input, [string, number, boolean]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('longer type', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], default: <const>['b', 1, false] });
										const check: TypeCheck<typeof input, [string, number, boolean, string | undefined]> = input;
										expect(input).toEqual(['a', 0, true, undefined]);
									});

									it('longer default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>['b', 1, false, 'c'] });
										const check: TypeCheck<typeof input, [string, number, boolean]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('longer type and longer default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], default: <const>['b', 1, false, 'c'] });
										const check: TypeCheck<typeof input, [string, number, boolean, string]> = input;
										expect(input).toEqual(['a', 0, true, 'c']);
									});

								});

								describe('partial', () => {

									it('input', () => {
										const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], default: <const>['d', false, 'e'] });
										const check: TypeCheck<typeof input, [string, boolean, string]> = input;
										expect(input).toEqual(['a', false, 'c']);
									});

									it('default', () => {
										const input = getInput({ input: 'alpha', type: <const>[String, String, String], default: <const>['d', undefined, 'e'] });
										const check: TypeCheck<typeof input, [string, string | undefined, string]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('input and default', () => {
										const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], default: <const>['d', undefined, undefined] });
										const check: TypeCheck<typeof input, [string, boolean | undefined, string | undefined]> = input;
										expect(input).toEqual(['a', undefined, 'c']);
									});

								});

							});

						});

						describe('empty', () => {

							it('empty default', () => {
								const input = getInput({ input: 'empty', type: [String], default: [] });
								const check: TypeCheck<typeof input, (string | undefined)[]> = input;
								expect(input).toEqual([]);
							});

							it('with default', () => {
								const input = getInput({ input: 'empty', type: [String], default: <const>['x', 'y', 'z'] });
								const check: TypeCheck<typeof input, [string, string, string, ...(string | undefined)[]]> = input;
								expect(input).toEqual(['x', 'y', 'z']);
							});
						});

						it('non existent', () => {
							const input = getInput({ input: 'xyz', type: [String], default: <const>['x', 'y', 'z'] });
							const check: TypeCheck<typeof input, [string, string, string, ...(string | undefined)[]]> = input;
							expect(input).toEqual(['x', 'y', 'z']);
						});

					});

				});

				describe('required', () => {

					describe('string', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: String, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: String, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: String, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

					});

					describe('boolean', () => {

						it('existent', () => {
							const input = getInput({ input: 'true', type: Boolean, required: true, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(true);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Boolean, required: true, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(false);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Boolean, required: true, default: false });
							const check: TypeCheck<typeof input, boolean> = input;
							expect(input).toEqual(false);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Boolean });
								const check: TypeCheck<typeof input, boolean | undefined> = input;
							}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
						});

					});

					describe('number', () => {

						it('existent', () => {
							const input = getInput({ input: 'zero', type: Number, required: true, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(0);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Number, required: true, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(1);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Number, required: true, default: 1 });
							const check: TypeCheck<typeof input, number> = input;
							expect(input).toEqual(1);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Number, required: true, default: 1 });
								const check: TypeCheck<typeof input, number> = input;
							}).toThrow('input has to be a valid number');
						});

					});

					describe('function', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: (val: string) => val, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: (val: string) => val, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: (val: string) => val, required: true, default: 'xyz' });
							const check: TypeCheck<typeof input, string> = input;
							expect(input).toEqual('xyz');
						});

					});

					describe('multi element', () => {

						describe('sepatrated by', () => {

							it('nothing (single element)', () => {
								const input = getInput({ input: 'abc', type: <const>[String], required: true, default: <const>['xyz'] });
								const check: TypeCheck<typeof input, [string, ...string[]]> = input;
								expect(input).toEqual(['abc']);
							});

							describe('comma', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'alpha', type: <const>[String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'beta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

							});

							describe('newline', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'gamma', type: [String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'delta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

							});

							describe('both', () => {

								it('not trailing', () => {
									const input = getInput({ input: 'epsilon', type: [String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

								it('trailing', () => {
									const input = getInput({ input: 'zeta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
									const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
									expect(input).toEqual(['a', 'b', 'c']);
								});

							});
						});

						describe('typing', () => {

							describe('array', () => {

								it('shorter', () => {
									const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[false, true, false] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, ...boolean[]]> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								it('same length', () => {
									const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[false, true, false, true] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, ...boolean[]]> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								it('longer', () => {
									const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[false, true, false, true, false] });
									const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean, ...boolean[]]> = input;
									expect(input).toEqual([true, false, true, false, false]);
								});

							});

							describe('tuple', () => {

								describe('single type', () => {

									it('shorter type', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true]);
									});

									it('shorter default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('shorter type and default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true]);
									});

									it('same length', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer type', () => {
										expect(() => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true] });
											const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean]> = input;
										}).toThrow('input array `eta` contains elements that could not be parsed');
									});

									it('longer default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer type and default', () => {
										const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[false, true, false, true, false] });
										const check: TypeCheck<typeof input, [boolean, boolean, boolean, boolean, boolean]> = input;
										expect(input).toEqual([true, false, true, false, false]);
									});

								});

								describe('multiple types', () => {

									it('shorter type', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number], required: true, default: <const>['b', 1, true] });
										const check: TypeCheck<typeof input, [string, number]> = input;
										expect(input).toEqual(['a', 0]);
									});

									it('shorter default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>['b', 1] });
										const check: TypeCheck<typeof input, [string, number, boolean]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('shorter type and default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number], required: true, default: <const>['b', 1] });
										const check: TypeCheck<typeof input, [string, number]> = input;
										expect(input).toEqual(['a', 0]);
									});

									it('same length', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>['b', 1, false] });
										const check: TypeCheck<typeof input, [string, number, boolean]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('longer type', () => {
										expect(() => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true, default: <const>['b', 1, false] });
											const check: TypeCheck<typeof input, [string, number, boolean, string]> = input;
										}).toThrow('input array `theta` contains elements that could not be parsed');
									});

									it('longer default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>['b', 1, false, 'c'] });
										const check: TypeCheck<typeof input, [string, number, boolean]> = input;
										expect(input).toEqual(['a', 0, true]);
									});

									it('longer type and default', () => {
										const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true, default: <const>['b', 1, false, 'c'] });
										const check: TypeCheck<typeof input, [string, number, boolean, string]> = input;
										expect(input).toEqual(['a', 0, true, 'c']);
									});

								});

								describe('partial', () => {

									it('input', () => {
										const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true, default: <const>['d', false, 'e'] });
										const check: TypeCheck<typeof input, [string, boolean, string]> = input;
										expect(input).toEqual(['a', false, 'c']);
									});

									it('default', () => {
										const input = getInput({ input: 'alpha', type: <const>[String, String, String], required: true, default: <const>['d', undefined, 'e'] });
										const check: TypeCheck<typeof input, [string, string, string]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('input and default', () => {
										expect(() => {
											const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true, default: <const>['d', undefined, undefined] });
											const check: TypeCheck<typeof input, [string, boolean, string]> = input;
										}).toThrow('input array `partial` contains elements that could not be parsed');
									});

								});

							});

						});

						describe('empty', () => {

							it('empty default', () => {
								const input = getInput({ input: 'empty', type: [String], required: true, default: [] });
								const check: TypeCheck<typeof input, string[]> = input;
								expect(input).toEqual([]);
							});

							it('with default', () => {
								const input = getInput({ input: 'empty', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
								expect(input).toEqual(['x', 'y', 'z']);
							});
						});

						it('non existent', () => {
							const input = getInput({ input: 'xyz', type: [String], required: true, default: <const>['x', 'y', 'z'] });
							const check: TypeCheck<typeof input, [string, string, string, ...string[]]> = input;
							expect(input).toEqual(['x', 'y', 'z']);
						});

					});

				});

			});

			describe('different type', () => {

				describe('optional', () => {

					describe('string', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: String, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: String, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: String, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

					});

					describe('boolean', () => {

						it('existent', () => {
							const input = getInput({ input: 'true', type: Boolean, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(true);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Boolean, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(10);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Boolean, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(10);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Boolean, default: 10 });
								const check: TypeCheck<typeof input, boolean | number> = input;
							}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
						});

					});

					describe('number', () => {

						it('existent', () => {
							const input = getInput({ input: 'zero', type: Number, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual(0);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Number, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual('rst');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Number, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual('rst');
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Number, default: 'rst' });
								const check: TypeCheck<typeof input, number | string> = input;
							}).toThrow('input has to be a valid number');
						});

					});

					describe('function', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: (val: string) => val, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: (val: string) => val, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: (val: string) => val, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

					});

					describe('multi element', () => {

						describe('single default', () => {

							describe('sepatrated by', () => {

								it('nothing (single element)', () => {
									const input = getInput({ input: 'abc', type: [String], default: 10 });
									const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
									expect(input).toEqual(['abc']);
								});

								describe('comma', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'alpha', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'beta', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});

								describe('newline', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'gamma', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'delta', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});

								describe('mixed', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'epsilon', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'zeta', type: [String], default: 10 });
										const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});
							});
							describe('typing', () => {

								it('array', () => {
									const input = getInput({ input: 'eta', type: [Boolean], default: 10 });
									const check: TypeCheck<typeof input, (boolean | number)[] | undefined> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								describe('tuple', () => {

									describe('single type', () => {

										it('shorter', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number] | undefined> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('same length', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number, boolean | number] | undefined> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number, boolean | number, boolean | number] | undefined> = input;
											expect(input).toEqual([true, false, true, false, 10]);
										});

									});

									describe('multiple types', () => {

										it('shorter', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], default: 10 });
											const check: TypeCheck<typeof input, [string | number, number] | undefined> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('same length', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: 10 });
											const check: TypeCheck<typeof input, [string | number, number, boolean | number] | undefined> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], default: 10 });
											const check: TypeCheck<typeof input, [string | number, number, boolean | number, string | number] | undefined> = input;
											expect(input).toEqual(['a', 0, true, 10]);
										});

									});

									it('partial', () => {
										const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], default: 10 });
										const check: TypeCheck<typeof input, [string | number, boolean | number, string | number] | undefined> = input;
										expect(input).toEqual(['a', 10, 'c']);
									});

								});

							});

							it('empty', () => {
								const input = getInput({ input: 'empty', type: <const>[String], default: 10 });
								const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
								expect(input).toEqual([]);
							});

							it('non existent', () => {
								const input = getInput({ input: 'xyz', type: <const>[String], default: 10 });
								const check: TypeCheck<typeof input, (string | number)[] | undefined> = input;
								expect(input).toEqual(undefined);
							});

						});

						describe('multi element default', () => {

							describe('sepatrated by', () => {

								it('nothing (single element)', () => {
									const input = getInput({ input: 'abc', type: <const>[String], default: <const>[10] });
									const check: TypeCheck<typeof input, [string | 10, ...(string | undefined)[]]> = input;
									expect(input).toEqual(['abc']);
								});

								describe('comma', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'alpha', type: <const>[String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'beta', type: [String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});

								describe('newline', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'gamma', type: [String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'delta', type: [String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});

								describe('mixed', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'epsilon', type: [String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'zeta', type: [String], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...(string | undefined)[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});
							});
							describe('typing', () => {

								describe('array', () => {

									it('shorter', () => {
										const input = getInput({ input: 'eta', type: [Boolean], default: <const>[10, 11, 12] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, ...(boolean | undefined)[]]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('same length', () => {
										const input = getInput({ input: 'eta', type: [Boolean], default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, ...(boolean | undefined)[]]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer', () => {
										const input = getInput({ input: 'eta', type: [Boolean], default: <const>[10, 11, 12, 13, 14] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean | 14, ...(boolean | undefined)[]]> = input;
										expect(input).toEqual([true, false, true, false, 14]);
									});

								});

								describe('tuple', () => {

									describe('single type', () => {

										it('shorter type', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], default: <const>[10, 11, 12, 13] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12]> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('shorter default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[10, 11, 12] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | undefined]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('shorter type and default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], default: <const>[10, 11, 12] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12]> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('same length', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[10, 11, 12, 13] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer type', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: <const>[10, 11, 12, 13] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean | undefined]> = input;
											expect(input).toEqual([true, false, true, false, undefined]);
										});

										it('longer default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], default: <const>[10, 11, 12, 13, 14] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer type and default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: <const>[10, 11, 12, 13, 14] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean | 14]> = input;
											expect(input).toEqual([true, false, true, false, 14]);
										});

									});

									describe('multiple types', () => {

										it('shorter type', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], default: <const>[false, 'x', 10] });
											const check: TypeCheck<typeof input, [string | false, number | 'x']> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('shorter default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>[false, 'x'] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | undefined]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('shorter type and default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], default: <const>[false, 'x'] });
											const check: TypeCheck<typeof input, [string | false, number | 'x']> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('same length', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>[false, 'x', 10] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer type', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], default: <const>[false, 'x', 10] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10, string | undefined]> = input;
											expect(input).toEqual(['a', 0, true, undefined]);
										});

										it('longer default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], default: <const>[false, 'x', 10, 11] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], default: <const>[false, 'x', 10, 11] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10, string | 11]> = input;
											expect(input).toEqual(['a', 0, true, 11]);
										});

									});

									describe('partial', () => {

										it('input', () => {
											const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], default: <const>[11, 'xyz', 12] });
											const check: TypeCheck<typeof input, [string | 11, boolean | 'xyz', string | 12]> = input;
											expect(input).toEqual(['a', 'xyz', 'c']);
										});

										it('default', () => {
											const input = getInput({ input: 'alpha', type: <const>[String, String, String], default: <const>[11, undefined, 12] });
											const check: TypeCheck<typeof input, [string | 11, string | undefined, string | 12]> = input;
											expect(input).toEqual(['a', 'b', 'c']);
										});

										it('input and default', () => {
											const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], default: <const>[11, undefined, undefined] });
											const check: TypeCheck<typeof input, [string | 11, boolean | undefined, string | undefined]> = input;
											expect(input).toEqual(['a', undefined, 'c']);
										});

									});

								});

							});

							describe('empty', () => {

								it('empty default', () => {
									const input = getInput({ input: 'empty', type: [String], default: [] });
									const check: TypeCheck<typeof input, (string | undefined)[]> = input;
									expect(input).toEqual([]);
								});

								it('with default', () => {
									const input = getInput({ input: 'empty', type: [String], default: <const>[10, 11, 12] });
									const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, ...(string | undefined)[]]> = input;
									expect(input).toEqual([10, 11, 12]);
								});
							});

							it('non existent', () => {
								const input = getInput({ input: 'xyz', type: [String], default: <const>[10, 11, 12] });
								const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, ...(string | undefined)[]]> = input;
								expect(input).toEqual([10, 11, 12]);
							});

						});

					});

				});

				describe('required', () => {

					describe('string', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: String, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: String, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: String, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

					});

					describe('boolean', () => {

						it('existent', () => {
							const input = getInput({ input: 'true', type: Boolean, required: true, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(true);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Boolean, required: true, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(10);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Boolean, required: true, default: 10 });
							const check: TypeCheck<typeof input, boolean | number> = input;
							expect(input).toEqual(10);
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Boolean, required: true, default: 10 });
								const check: TypeCheck<typeof input, boolean | number> = input;
							}).toThrow('boolean input has to be one of `true | True | TRUE | false | False | FALSE`');
						});

					});

					describe('number', () => {

						it('existent', () => {
							const input = getInput({ input: 'zero', type: Number, required: true, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual(0);
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: Number, required: true, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual('rst');
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: Number, required: true, default: 'rst' });
							const check: TypeCheck<typeof input, number | string> = input;
							expect(input).toEqual('rst');
						});

						it('invalid', () => {
							expect(() => {
								const input = getInput({ input: 'abc', type: Number, required: true, default: 'rst' });
								const check: TypeCheck<typeof input, number | string> = input;
							}).toThrow('input has to be a valid number');
						});

					});

					describe('function', () => {

						it('existent', () => {
							const input = getInput({ input: 'abc', type: (val: string) => val, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual('abc');
						});

						it('empty', () => {
							const input = getInput({ input: 'empty', type: (val: string) => val, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

						it('non-existent', () => {
							const input = getInput({ input: 'xyz', type: (val: string) => val, required: true, default: 10 });
							const check: TypeCheck<typeof input, string | number> = input;
							expect(input).toEqual(10);
						});

					});

					describe('multi element', () => {

						describe('single default', () => {

							describe('sepatrated by', () => {

								it('nothing (single element)', () => {
									const input = getInput({ input: 'abc', type: [String], required: true, default: 10 });
									const check: TypeCheck<typeof input, (string | number)[]> = input;
									expect(input).toEqual(['abc']);
								});

								describe('comma', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'alpha', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'beta', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});

								describe('newline', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'gamma', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'delta', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});

								describe('mixed', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'epsilon', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

									it('trailing', () => {
										const input = getInput({ input: 'zeta', type: [String], required: true, default: 10 });
										const check: TypeCheck<typeof input, (string | number)[]> = input;
										expect(input).toEqual(['a', 'b', 'c']);
									});

								});
							});
							describe('typing', () => {

								it('array', () => {
									const input = getInput({ input: 'eta', type: [Boolean], required: true, default: 10 });
									const check: TypeCheck<typeof input, (boolean | number)[]> = input;
									expect(input).toEqual([true, false, true, false]);
								});

								describe('tuple', () => {

									describe('single type', () => {

										it('shorter', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number]> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('same length', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number, boolean | number]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: 10 });
											const check: TypeCheck<typeof input, [boolean | number, boolean | number, boolean | number, boolean | number, boolean | number]> = input;
											expect(input).toEqual([true, false, true, false, 10]);
										});

									});

									describe('multiple types', () => {

										it('shorter', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], required: true, default: 10 });
											const check: TypeCheck<typeof input, [string | number, number]> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('same length', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: 10 });
											const check: TypeCheck<typeof input, [string | number, number, boolean | number]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true, default: 10 });
											const check: TypeCheck<typeof input, [string | number, number, boolean | number, string | number]> = input;
											expect(input).toEqual(['a', 0, true, 10]);
										});

									});

									it('partial', () => {
										const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true, default: 10 });
										const check: TypeCheck<typeof input, [string | number, boolean | number, string | number]> = input;
										expect(input).toEqual(['a', 10, 'c']);
									});

								});

							});

							it('empty', () => {
								const input = getInput({ input: 'empty', type: [String], required: true, default: 10 });
								const check: TypeCheck<typeof input, (string | number)[]> = input;
								expect(input).toEqual([]);
							});

							it('non existent', () => {
								expect(() => {
									const input = getInput({ input: 'xyz', type: [String], required: true, default: 10 });
									const check: TypeCheck<typeof input, (string | number)[]> = input;
								}).toThrow('input `xyz` is required but was not provided');
							});

						});

						describe('multi element default', () => {

							describe('sepatrated by', () => {

								it('nothing (single element)', () => {
									const input = getInput({ input: 'abc', type: [String], required: true, default: <const>[10] });
									const check: TypeCheck<typeof input, [string | 10, ...string[]]> = input;
									expect(input).toEqual(['abc']);
								});

								describe('comma', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'alpha', type: <const>[String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'beta', type: [String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});

								describe('newline', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'gamma', type: [String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'delta', type: [String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});

								describe('mixed', () => {

									it('not trailing', () => {
										const input = getInput({ input: 'epsilon', type: [String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

									it('trailing', () => {
										const input = getInput({ input: 'zeta', type: [String], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, string | 13, ...string[]]> = input;
										expect(input).toEqual(['a', 'b', 'c', 13]);
									});

								});
							});
							describe('typing', () => {

								describe('array', () => {

									it('shorter', () => {
										const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[10, 11, 12] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, ...boolean[]]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('same length', () => {
										const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[10, 11, 12, 13] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, ...boolean[]]> = input;
										expect(input).toEqual([true, false, true, false]);
									});

									it('longer', () => {
										const input = getInput({ input: 'eta', type: [Boolean], required: true, default: <const>[10, 11, 12, 13, 14] });
										const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean | 14, ...boolean[]]> = input;
										expect(input).toEqual([true, false, true, false, 14]);
									});

								});

								describe('tuple', () => {

									describe('single type', () => {

										it('shorter type', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12, 13] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12]> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('shorter default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('shorter type and default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12]> = input;
											expect(input).toEqual([true, false, true]);
										});

										it('same length', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12, 13] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer type', () => {
											expect(() => {
												const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12, 13] });
												const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean]> = input;
											}).toThrow('input array `eta` contains elements that could not be parsed');
										});

										it('longer default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12, 13, 14] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13]> = input;
											expect(input).toEqual([true, false, true, false]);
										});

										it('longer type and default', () => {
											const input = getInput({ input: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: <const>[10, 11, 12, 13, 14] });
											const check: TypeCheck<typeof input, [boolean | 10, boolean | 11, boolean | 12, boolean | 13, boolean | 14]> = input;
											expect(input).toEqual([true, false, true, false, 14]);
										});

									});

									describe('multiple types', () => {

										it('shorter type', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], required: true, default: <const>[false, 'x', 10] });
											const check: TypeCheck<typeof input, [string | false, number | 'x']> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('shorter default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>[false, 'x'] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('shorter type and default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number], required: true, default: <const>[false, 'x'] });
											const check: TypeCheck<typeof input, [string | false, number | 'x']> = input;
											expect(input).toEqual(['a', 0]);
										});

										it('same length', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>[false, 'x', 10] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer type', () => {
											expect(() => {
												const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true, default: <const>[false, 'x', 10] });
												const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10, string]> = input;
											}).toThrow('input array `theta` contains elements that could not be parsed');
										});

										it('longer default', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean], required: true, default: <const>[false, 'x', 10, 11] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10]> = input;
											expect(input).toEqual(['a', 0, true]);
										});

										it('longer', () => {
											const input = getInput({ input: 'theta', type: <const>[String, Number, Boolean, (val: string) => val], required: true, default: <const>[false, 'x', 10, 11] });
											const check: TypeCheck<typeof input, [string | false, number | 'x', boolean | 10, string | 11]> = input;
											expect(input).toEqual(['a', 0, true, 11]);
										});

									});

									describe('partial', () => {

										it('input', () => {
											const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true, default: <const>[11, 'xyz', 12] });
											const check: TypeCheck<typeof input, [string | 11, boolean | 'xyz', string | 12]> = input;
											expect(input).toEqual(['a', 'xyz', 'c']);
										});

										it('default', () => {
											const input = getInput({ input: 'alpha', type: <const>[String, String, String], required: true, default: <const>[11, 'xyz', undefined] });
											const check: TypeCheck<typeof input, [string | 11, string | 'xyz', string]> = input;
											expect(input).toEqual(['a', 'b', 'c']);
										});

										it('input and default', () => {
											expect(() => {
												const input = getInput({ input: 'partial', type: <const>[String, Boolean, String], required: true, default: <const>[11, undefined, undefined] });
												const check: TypeCheck<typeof input, [string | 11, boolean, string]> = input;
											}).toThrow('input array `partial` contains elements that could not be parsed');
										});

									});

								});

							});

							describe('empty', () => {

								it('empty default', () => {
									const input = getInput({ input: 'empty', type: [String], required: true, default: [] });
									const check: TypeCheck<typeof input, string[]> = input;
									expect(input).toEqual([]);
								});

								it('with default', () => {
									const input = getInput({ input: 'empty', type: [String], required: true, default: <const>[10, 11, 12] });
									const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, ...string[]]> = input;
									expect(input).toEqual([10, 11, 12]);
								});
							});

							it('non existent', () => {
								const input = getInput({ input: 'xyz', type: [String], required: true, default: <const>[10, 11, 12] });
								const check: TypeCheck<typeof input, [string | 10, string | 11, string | 12, ...string[]]> = input;
								expect(input).toEqual([10, 11, 12]);
							});

						});

					});

				});

			});

		});

	});

});

it('getInputs', () => {
	const {
		test1,
		test2,
		test3,
		test4,
		test5,
		test6,
		test7,
		test8,
		test9,
		test10,
		test11,
		test12,
	} = getInputs({
		test1: 'abc',
		test2: ['def', 'abc'],
		test3: {
			input: 'abc',
			type: String,
		},
		test4: {
			input: 'true',
			type: Boolean,
		},
		test5: {
			input: 'zero',
			type: Number,
		},
		test6: {
			input: 'eta',
			type: [Boolean],
		},
		test7: {
			input: 'theta',
			type: <const>[String, Number, Boolean],
		},
		test8: {
			input: 'eta',
			type: [Boolean],
			required: true,
		},
		test9: {
			input: 'theta',
			type: <const>[String, Number, Boolean],
			required: true,
		},
		test10: {
			input: 'xyz',
			type: String,
			default: 'xyz',
		},
		test11: {
			input: 'xyz',
			type: Boolean,
			default: false,
		},
		test12: {
			input: 'xyz',
			type: Number,
			default: 1,
		},
	});

	expect(test1).toEqual('abc');
	expect(test2).toEqual('def');
	expect(test3).toEqual('abc');
	expect(test4).toEqual(true);
	expect(test5).toEqual(0);
	expect(test6).toEqual([true, false, true, false]);
	expect(test7).toEqual(['a', 0, true]);
	expect(test8).toEqual([true, false, true, false]);
	expect(test9).toEqual(['a', 0, true]);
	expect(test10).toEqual('xyz');
	expect(test11).toEqual(false);
	expect(test12).toEqual(1);
});