const assert = require('assert');
const path = require('path');
const { getObject } = require('../../../../utils');

const sideEffects = [];

module.exports = {
	description: 'does not include modules without used exports if moduleSideEffect is false',
	context: {
		sideEffects
	},
	exports() {
		assert.deepStrictEqual(sideEffects, [
			'sideeffects-false-usereffects-false-used-import',
			'sideeffects-null-usereffects-false-used-import',
			'sideeffects-true-usereffects-false',
			'sideeffects-true-usereffects-false-unused-import',
			'sideeffects-true-usereffects-false-used-import',
			'sideeffects-false-usereffects-true-used-import',
			'sideeffects-null-usereffects-true',
			'sideeffects-null-usereffects-true-unused-import',
			'sideeffects-null-usereffects-true-used-import',
			'sideeffects-true-usereffects-true',
			'sideeffects-true-usereffects-true-unused-import',
			'sideeffects-true-usereffects-true-used-import'
		]);
	},
	options: {
		strictDeprecations: false,
		treeshake: {
			moduleSideEffects(id) {
				if (id.includes('main')) return true;
				return JSON.parse(id.split('-')[3]);
			}
		},
		plugins: {
			name: 'test-plugin',
			resolveId(id) {
				if (!path.isAbsolute(id)) {
					return {
						id,
						external: false,
						moduleSideEffects: JSON.parse(id.split('-')[1])
					};
				}
			},
			load(id) {
				if (!path.isAbsolute(id)) {
					const sideEffects = JSON.parse(id.split('-')[1]);
					const userEffects = JSON.parse(id.split('-')[3]);
					assert.strictEqual(
						this.getModuleInfo(id).hasModuleSideEffects,
						typeof sideEffects === 'boolean' ? sideEffects : userEffects
					);
					return `export const value = '${id}'; sideEffects.push(value);`;
				}
			},
			buildEnd() {
				assert.deepStrictEqual(
					getObject(
						[...this.getModuleIds()]
							.filter(id => !path.isAbsolute(id))
							.map(id => [id, this.getModuleInfo(id).hasModuleSideEffects])
					),
					{
						'sideeffects-false-usereffects-false': false,
						'sideeffects-false-usereffects-false-unused-import': false,
						'sideeffects-false-usereffects-false-used-import': false,
						'sideeffects-false-usereffects-true': false,
						'sideeffects-false-usereffects-true-unused-import': false,
						'sideeffects-false-usereffects-true-used-import': false,
						'sideeffects-null-usereffects-false': false,
						'sideeffects-null-usereffects-false-unused-import': false,
						'sideeffects-null-usereffects-false-used-import': false,
						'sideeffects-null-usereffects-true': true,
						'sideeffects-null-usereffects-true-unused-import': true,
						'sideeffects-null-usereffects-true-used-import': true,
						'sideeffects-true-usereffects-false': true,
						'sideeffects-true-usereffects-false-unused-import': true,
						'sideeffects-true-usereffects-false-used-import': true,
						'sideeffects-true-usereffects-true': true,
						'sideeffects-true-usereffects-true-unused-import': true,
						'sideeffects-true-usereffects-true-used-import': true
					}
				);
			}
		}
	},
	warnings(warnings) {
		for (const warning of warnings) {
			assert.strictEqual(warning.code, 'DEPRECATED_FEATURE');
		}
	}
};
