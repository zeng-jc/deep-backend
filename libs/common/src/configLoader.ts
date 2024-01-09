// import { readFileSync } from 'fs';
// const configFile = readFileSync(
//   `${resolve(process.cwd())}/config/${
//     process.env.APP_ENV ?? 'local'
//   }.config.js`,
//   'utf-8',
// );
import { resolve } from 'path';

export function configLoader(key: string): string {
  let configFile;
  try {
    const fileName = `${process.env.APP_ENV ?? 'local'}.config.js`;
    configFile = require(resolve(process.cwd(), `./config/${fileName}`));
  } catch (error) {
    console.log(error);
  }
  console.log('configFile', configFile);
  console.log('process.env', process.env.APP_ENV);
  return key;
}
