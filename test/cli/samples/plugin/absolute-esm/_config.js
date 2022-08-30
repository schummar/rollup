const { sep } = require('path');

module.exports = {
	description: 'ESM CLI --plugin /absolute/path',
	command: `rollup main.js -p "${__dirname}${sep}my-esm-plugin.mjs={comment: 'Absolute ESM'}"`
};
