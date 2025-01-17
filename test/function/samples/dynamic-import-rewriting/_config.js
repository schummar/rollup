const assert = require('assert');

module.exports = {
	description: 'Dynamic import string specifier resolving',
	options: {
		external: ['asdf'],
		plugins: [
			{
				resolveDynamicImport() {
					return 'asdf';
				}
			}
		]
	},
	exports(exports) {
		const expectedError = "Cannot find package 'asdf'";
		return exports.promise.catch(err =>
			assert.strictEqual(err.message.slice(0, expectedError.length), expectedError)
		);
	}
};
