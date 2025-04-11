import dotenv from 'dotenv';
dotenv.config();

// Get the base64 encoded credentials from the .env file
const encodedCredentials = process.env.GOOGLE_CREDENTIALS_BASE64;
// Decode the credentials
const credentialsJson = Buffer.from(encodedCredentials, 'base64').toString('utf-8');

export default JSON.parse(credentialsJson)