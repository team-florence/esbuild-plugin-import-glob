"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = __importDefault(require("fast-glob"));
const EsbuildPluginImportGlob = (config) => ({
    name: 'require-context',
    setup: (build) => {
        build.onResolve({ filter: /\*/ }, async (args) => {
            if (args.resolveDir === '') {
                return; // Ignore unresolvable paths
            }
            return {
                path: args.path,
                namespace: 'import-glob',
                pluginData: {
                    resolveDir: args.resolveDir,
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'import-glob' }, async (args) => {
            var _a;
            const files = (await (0, fast_glob_1.default)(args.path, {
                cwd: args.pluginData.resolveDir,
                ignore: (_a = config === null || config === void 0 ? void 0 : config.ignorePaths) !== null && _a !== void 0 ? _a : [],
            })).sort();
            let importerCode = `
        ${files
                .map((module, index) => `import * as module${index} from '${module}'`)
                .join(';')}

        const modules = [${files
                .map((module, index) => `module${index}`)
                .join(',')}];

        export default modules;
        export const filenames = [${files
                .map((module, index) => `'${module}'`)
                .join(',')}]
      `;
            return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
        });
    },
});
exports.default = EsbuildPluginImportGlob;
