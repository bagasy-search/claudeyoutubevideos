// Local launcher: inherit credentials directly from the original repo in this process only.
// Example: node scripts/rayvault_with_env.mjs scripts/farm.mjs rayvault Rayvault 30000 60 @_rayvault_assets.txt
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
if (!process.argv[2]) throw new Error('Pass the Node script followed by its arguments');
Object.assign(process.env, parseEnv(readFileSync('C:/Users/bauti/Downloads/video2/.env', 'utf8')));
const result = spawnSync(process.execPath, process.argv.slice(2), {env: process.env, stdio: 'inherit'});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
