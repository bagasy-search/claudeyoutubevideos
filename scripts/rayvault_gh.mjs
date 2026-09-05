import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
Object.assign(process.env,parseEnv(readFileSync('C:/Users/bauti/Downloads/video2/.env','utf8')));
const command=process.argv[2]==='--git'?'git':'gh';
const args=process.argv.slice(command==='git'?3:2);
const config=command==='git'?['-c','credential.helper=','-c','credential.helper=!gh auth git-credential']:[];
const r=spawnSync(command,[...config,...args],{env:process.env,stdio:'inherit'});
if(r.error)throw r.error;process.exit(r.status??1);
