import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';
import fs from 'fs';
import { Buffer } from 'buffer'
// Get the current module's URL (import.meta.url)
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module (like __dirname)
const __dirname = dirname(__filename);

console.log(__filename);  // Logs the absolute path of the current file
console.log(__dirname);   // Logs the absolute directory path of the current file

const credentialsPath = join(__dirname, 'creds.json');
const credentials = fs.readFileSync(credentialsPath, 'utf-8');
const encodedCredentials = Buffer.from(credentials).toString('base64');
console.log(encodedCredentials);

const credentialsJson = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
console.log('\n\n\n-->',credentialsJson)


