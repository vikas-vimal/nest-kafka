import * as dotenv from 'dotenv';
import * as path from 'path';
const envPath = process.env.NODE_ENV
  ? `./envs/.env.${process.env.NODE_ENV}`
  : `/.env`;
dotenv.config({
  path: path.join(process.cwd(), envPath),
});
console.log('env path', process.env.NODE_ENV, envPath);
