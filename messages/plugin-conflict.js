"use strict";

module.exports = function (it) {
	const { pluginId, plugins } = it;

	let result = `ESLint couldn't determine the plugin "${pluginId}" uniquely.
`;

	for (const { filePath, importerName } of plugins) {
		result += `
- ${filePath} (loaded in "${importerName}")`;
	}

	result += `

Please remove the "plugins" setting from either config or remove either plugin installation.

If you still can't figure out the problem, please see https://eslint.org/docs/latest/use/troubleshooting.
`;

	return result;
};
