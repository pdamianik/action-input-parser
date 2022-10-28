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
			expect(input).toEqual('abc');
		});

		it('empty', () => {
			const input = getInput('empty');
			expect(input).toEqual('');
		});

		it('non-existent', () => {
			const input = getInput('xyz');
			expect(input).toEqual(undefined);
		});

	});


	describe('multiple', () => {

		it('non-existing, non-existing', () => {
			const input = getInput(['uvw', 'xyz']);
			expect(input).toEqual(undefined);
		});

		it('existing, non-existing', () => {
			const input = getInput(['def', 'xyz']);
			expect(input).toEqual('def');
		});

		it('non-existing, existing', () => {
			const input = getInput(['xyz', 'def']);
			expect(input).toEqual('def');
		});

		it('existing, existing', () => {
			const input = getInput(['def', 'abc']);
			expect(input).toEqual('def');
		});

	});

	describe('with options', () => {

		describe('key', () => {

			describe('single', () => {

				it('existent', () => {
					const input = getInput({ key: 'abc' });
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ key: 'empty' });
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					const input = getInput({ key: 'xyz' });
					expect(input).toEqual(undefined);
				});

			});

			describe('multiple', () => {

				it('non-existing, non-existing', () => {
					const input = getInput({
						key: ['uvw', 'xyz'],
					});
					expect(input).toEqual(undefined);
				});

				it('existing, non-existing', () => {
					const input = getInput({
						key: ['def', 'xyz'],
					});
					expect(input).toEqual('def');
				});

				it('non-existing, existing', () => {
					const input = getInput({
						key: ['def', 'abc'],
					});
					expect(input).toEqual('def');
				});

				it('existing, existing', () => {
					const input = getInput({
						key: ['def', 'abc'],
					});
					expect(input).toEqual('def');
				});

			});

		});

		describe('type', () => {

			describe('string', () => {

				it('valid', () => {
					const input = getInput({ key: 'abc', type: String });
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: String });
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					const input = getInput({ key: 'xyz', type: String });
					expect(input).toEqual(undefined);
				});

			});

			describe('boolean', () => {

				it('valid', () => {
					const input = getInput({ key: 'true', type: Boolean });
					expect(input).toEqual(true);
				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: Boolean });
					expect(input).toEqual(undefined);
				});

				it('non-existent', () => {
					const input = getInput({ key: 'xyz', type: Boolean });
					expect(input).toEqual(undefined);
				});

				it('invalid', () => {
					expect(() => {
						getInput({ key: 'abc', type: Boolean });
					}).toThrow('boolean input has to be one of \`true | True | TRUE | false | False | FALSE\`');
				});

			});

			describe('number', () => {

				it('valid', () => {
					const input = getInput({ key: 'zero', type: Number });
					expect(input).toEqual(0);
				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: Number });
					expect(input).toEqual(undefined);
				});

				it('non-existent', () => {
					const input = getInput({ key: 'xyz', type: Number });
					expect(input).toEqual(undefined);
				});

				it('invalid', () => {
					expect(() => {
						getInput({ key: 'abc', type: Number });
					}).toThrow('input has to be a valid number');
				});

			});

			describe('multi element', () => {

				describe('sepatrated by', () => {

					describe('comma', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'alpha', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'beta', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('newline', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'gamma', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'delta', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('mixed', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'epsilon', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'zeta', type: [String] });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});
				});
				describe('typing', () => {

					it('array', () => {
						const input = getInput({ key: 'eta', type: [Boolean] });
						expect(input).toEqual([true, false, true, false]);
					});

					describe('tuple', () => {

						describe('single type', () => {

							it('shorter', () => {
								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean] });
								expect(input).toEqual([true, false, true]);
							});

							it('same length', () => {
								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean] });
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean] });
								expect(input).toEqual([true, false, true, false, undefined]);
							});

						});

						describe('multiple types', () => {

							it('shorter', () => {
								const input = getInput({ key: 'theta', type: <const>[String, Number] });
								expect(input).toEqual(['a', 0]);
							});

							it('same length', () => {
								const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean] });
								expect(input).toEqual(['a', 0, true]);
							});

							it('longer', () => {
								const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean, String] });
								expect(input).toEqual(['a', 0, true, undefined]);
							});

						});

						it('partial', () => {
							const input = getInput({ key: 'partial', type: <const>[String, Boolean, String] });
							expect(input).toEqual(['a', undefined, 'c']);
						});

					});

				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: [String] });
					expect(input).toEqual([]);
				});

				it('non existent', () => {
					const input = getInput({ key: 'xyz', type: [String] });
					expect(input).toEqual(undefined);
				});

			});

		});

		describe('required', () => {

			describe('string', () => {

				it('existent', () => {
					const input = getInput({ key: 'abc', type: String, required: true });
					expect(input).toEqual('abc');
				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: String, required: true });
					expect(input).toEqual('');
				});

				it('non-existent', () => {
					expect(() => {
						getInput({ key: 'xyz', type: String, required: true });
					}).toThrowError();
				});

			});

			describe('boolean', () => {

				it('existent', () => {
					const input = getInput({ key: 'true', type: Boolean, required: true });
					expect(input).toEqual(true);
				});

				it('empty', () => {
					expect(() => {
						getInput({ key: 'empty', type: Boolean, required: true });
					}).toThrowError();
				});

				it('non-existent', () => {
					expect(() => {
						getInput({ key: 'xyz', type: Boolean, required: true });
					}).toThrowError();
				});

			});

			describe('number', () => {

				it('existent', () => {
					const input = getInput({ key: 'zero', type: Number, required: true });
					expect(input).toEqual(0);
				});

				it('empty', () => {
					expect(() => {
						getInput({ key: 'empty', type: Number, required: true });
					}).toThrowError();
				});

				it('non-existent', () => {
					expect(() => {
						getInput({ key: 'xyz', type: Number, required: true });
					}).toThrowError();
				});

			});

			describe('multi element', () => {

				describe('sepatrated by', () => {

					describe('comma', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'alpha', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'beta', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('newline', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'gamma', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'delta', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});

					describe('both', () => {

						it('not trailing', () => {
							const input = getInput({ key: 'epsilon', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

						it('trailing', () => {
							const input = getInput({ key: 'zeta', type: [String], required: true });
							expect(input).toEqual(['a', 'b', 'c']);
						});

					});
				});

				describe('typing', () => {

					it('array', () => {
						const input = getInput({ key: 'eta', type: [Boolean], required: true });
						expect(input).toEqual([true, false, true, false]);
					});

					describe('tuple', () => {

						describe('single type', () => {

							it('shorter', () => {
								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true });
								expect(input).toEqual([true, false, true]);
							});

							it('same length', () => {
								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true });
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								expect(() => {
									getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true });
								}).toThrowError()
							});

						});

						describe('multiple types', () => {

							it('shorter', () => {
								const input = getInput({ key: 'theta', type: <const>[String, Number], required: true });
								expect(input).toEqual(['a', 0]);
							});

							it('same length', () => {
								const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean], required: true });
								expect(input).toEqual(['a', 0, true]);
							});

							it('longer', () => {
								expect(() => {
									getInput({ key: 'theta', type: <const>[String, Number, Boolean, String], required: true });
								}).toThrowError();
							});

						});

						it('partial', () => {
							expect(() => {
								getInput({ key: 'partial', type: <const>[String, Boolean, String], required: true });
							}).toThrowError();
						});

					});

				});

				it('empty', () => {
					const input = getInput({ key: 'empty', type: [String], required: true });
					expect(input).toEqual([]);
				});

				it('non existent', () => {
					expect(() => {
						getInput({ key: 'xyz', type: [String], required: true });
					}).toThrowError();
				});

			});

		});

		describe('default', () => {

			describe('not required', () => {

				describe('string', () => {

					it('existent', () => {
						const input = getInput({ key: 'abc', type: String, default: 'xyz' });
						expect(input).toEqual('abc');
					});

					it('empty', () => {
						const input = getInput({ key: 'empty', type: String, default: 'xyz' });
						expect(input).toEqual('');
					});

					it('non-existent', () => {
						const input = getInput({ key: 'xyz', type: String, default: 'xyz' });
						expect(input).toEqual('xyz');
					});

				});

				describe('boolean', () => {

					it('existent', () => {
						const input = getInput({ key: 'true', type: Boolean, default: false });
						expect(input).toEqual(true);
					});

					it('empty', () => {
						const input = getInput({ key: 'empty', type: Boolean, default: false });
						expect(input).toEqual(false);
					});

					it('non-existent', () => {
						const input = getInput({ key: 'xyz', type: Boolean, default: false });
						expect(input).toEqual(false);
					});

				});

				describe('number', () => {

					it('existent', () => {
						const input = getInput({ key: 'zero', type: Number, default: 1 });
						expect(input).toEqual(0);
					});

					it('empty', () => {
						const input = getInput({ key: 'empty', type: Number, default: 1 });
						expect(input).toEqual(1);
					});

					it('non-existent', () => {
						const input = getInput({ key: 'xyz', type: Number, default: 1 });
						expect(input).toEqual(1);
					});

				});

				describe('multi element', () => {

					describe('sepatrated by', () => {

						describe('comma', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'alpha', type: <const>[String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'beta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

						});

						describe('newline', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'gamma', type: [String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'delta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

						});

						describe('mixed', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'epsilon', type: [String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'zeta', type: [String], default: <const>['w', 'x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c', 'z']);
							});

						});
					});
					describe('typing', () => {

						describe('array', () => {

							it('shorter', () => {
								const input = getInput({ key: 'eta', type: [Boolean], default: <const>[false, true, false] });
								expect(input).toEqual([true, false, true, false]);
							});

							it('same length', () => {
								const input = getInput({ key: 'eta', type: [Boolean], default: <const>[false, true, false, true] });
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								const input = getInput({ key: 'eta', type: [Boolean], default: <const>[false, true, false, true, false] });
								expect(input).toEqual([true, false, true, false, false]);
							});

						});

						describe('tuple', () => {

							it('single type', () => {

								const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], default: [false, true, false, true, false] });
								expect(input).toEqual([true, false, true, false, false]);

							});

							describe('multiple types', () => {

								it('shorter', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number], default: ['b', 1] });
									expect(input).toEqual(['a', 0]);
								});

								it('same length', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean], default: ['b', 1, false] });
									expect(input).toEqual(['a', 0, true]);
								});

								it('longer', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean, String], default: ['b', 1, false, 'c'] });
									expect(input).toEqual(['a', 0, true, 'c']);
								});

							});

							it('partial', () => {
								const input = getInput({ key: 'partial', type: <const>[String, Boolean, String], default: ['d', false, 'e'] });
								expect(input).toEqual(['a', false, 'c']);
							});

						});

					});

					describe('empty', () => {

						it('empty default', () => {
							const input = getInput({ key: 'empty', type: [String], default: [] });
							expect(input).toEqual([]);
						});

						it('with default', () => {
							const input = getInput({ key: 'empty', type: [String], default: <const>['a', 'b', 'c'] });
							expect(input).toEqual(['a', 'b', 'c']);
						});
					});

					it('non existent', () => {
						const input = getInput({ key: 'xyz', type: [String], default: <const>['a', 'b', 'c'] });
						expect(input).toEqual(['a', 'b', 'c']);
					});

				});

			});

			describe('required', () => {

				describe('string', () => {

					it('existent', () => {
						const input = getInput({ key: 'abc', type: String, required: true, default: 'xyz' });
						expect(input).toEqual('abc');
					});

					it('empty', () => {
						const input = getInput({ key: 'empty', type: String, required: true, default: 'xyz' });
						expect(input).toEqual('');
					});

					it('non-existent', () => {
						expect(() => {
							getInput({ key: 'xyz', type: String, required: true, default: 'xyz' });
						}).toThrowError();
					});

				});

				describe('boolean', () => {

					it('existent', () => {
						const input = getInput({ key: 'true', type: Boolean, required: true, default: false });
						expect(input).toEqual(true);
					});

					it('empty', () => {
						expect(() => {
							getInput({ key: 'empty', type: Boolean, required: true, default: false });
						}).toThrowError();
					});

					it('non-existent', () => {
						expect(() => {
							getInput({ key: 'xyz', type: Boolean, required: true, default: false });
						}).toThrowError();
					});

				});

				describe('number', () => {

					it('existent', () => {
						const input = getInput({ key: 'zero', type: Number, required: true, default: 1 });
						expect(input).toEqual(0);
					});

					it('empty', () => {
						expect(() => {
							getInput({ key: 'empty', type: Number, required: true, default: 1 });
						}).toThrowError();
					});

					it('non-existent', () => {
						expect(() => {
							getInput({ key: 'xyz', type: Number, required: true, default: 1 });
						}).toThrowError();
					});

				});

				describe('multi element', () => {

					describe('sepatrated by', () => {

						describe('comma', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'alpha', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'beta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

						});

						describe('newline', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'gamma', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'delta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

						});

						describe('both', () => {

							it('not trailing', () => {
								const input = getInput({ key: 'epsilon', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

							it('trailing', () => {
								const input = getInput({ key: 'zeta', type: [String], required: true, default: <const>['x', 'y', 'z'] });
								expect(input).toEqual(['a', 'b', 'c']);
							});

						});
					});

					describe('typing', () => {

						describe('array', () => {

							it('shorter', () => {
								const input = getInput({ key: 'eta', type: [Boolean], required: true, default: <const>[false, true, false] });
								expect(input).toEqual([true, false, true, false]);
							});

							it('same length', () => {
								const input = getInput({ key: 'eta', type: [Boolean], required: true, default: <const>[false, true, false, true] });
								expect(input).toEqual([true, false, true, false]);
							});

							it('longer', () => {
								const input = getInput({ key: 'eta', type: [Boolean], required: true, default: <const>[false, true, false, true, false] });
								expect(input).toEqual([true, false, true, false, false]);
							});

						});

						describe('tuple', () => {

							describe('single type', () => {

								it('shorter', () => {
									const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean], required: true, default: [false, true, false] });
									expect(input).toEqual([true, false, true]);
								});

								it('same length', () => {
									const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean], required: true, default: [false, true, false, true] });
									expect(input).toEqual([true, false, true, false]);
								});

								it('longer', () => {
									const input = getInput({ key: 'eta', type: <const>[Boolean, Boolean, Boolean, Boolean, Boolean], required: true, default: [false, true, false, true, false] });
									expect(input).toEqual([true, false, true, false, false]);
								});

							});

							describe('multiple types', () => {

								it('shorter', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number], required: true, default: ['b', 1] });
									expect(input).toEqual(['a', 0]);
								});

								it('same length', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean], required: true, default: ['b', 1, false] });
									expect(input).toEqual(['a', 0, true]);
								});

								it('longer', () => {
									const input = getInput({ key: 'theta', type: <const>[String, Number, Boolean, String], required: true, default: ['b', 1, false, 'c'] });
									expect(input).toEqual(['a', 0, true, 'c']);
								});

							});

							it('partial', () => {
								const input = getInput({ key: 'partial', type: <const>[String, Boolean, String], required: true, default: ['d', false, 'e'] });
								expect(input).toEqual(['a', false, 'c']);
							});

						});

					});

					describe('empty', () => {

						it('empty default', () => {
							const input = getInput({ key: 'empty', type: [String], required: true, default: [] });
							expect(input).toEqual([]);
						});

						it('with default', () => {
							const input = getInput({ key: 'empty', type: [String], required: true, default: <const>['a', 'b', 'c'] });
							expect(input).toEqual(['a', 'b', 'c']);
						});
					});

					it('non existent', () => {
						expect(() => {
							getInput({ key: 'xyz', type: [String], required: true, default: <const>['a', 'b', 'c'] });
						}).toThrowError();
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
			key: 'abc',
			type: String,
		},
		test4: {
			key: 'true',
			type: Boolean,
		},
		test5: {
			key: 'zero',
			type: Number,
		},
		test6: {
			key: 'eta',
			type: [Boolean],
		},
		test7: {
			key: 'theta',
			type: <const>[String, Number, Boolean],
		},
		test8: {
			key: 'eta',
			type: [Boolean],
			required: true,
		},
		test9: {
			key: 'theta',
			type: <const>[String, Number, Boolean],
			required: true,
		},
		test10: {
			key: 'xyz',
			type: String,
			default: 'xyz',
		},
		test11: {
			key: 'xyz',
			type: Boolean,
			default: false,
		},
		test12: {
			key: 'xyz',
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