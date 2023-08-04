import { Plugin } from 'esbuild';
interface Config {
    ignorePaths: string[];
}
declare const EsbuildPluginImportGlob: (config: Config) => Plugin;
export default EsbuildPluginImportGlob;
