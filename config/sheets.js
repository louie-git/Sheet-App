import { google } from 'googleapis'

//converts base64 data from .env
import keys from '../creds.js'


let sheets = ''
// used to connect to Google Sheets
const connection = () => {

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  
  (async function () {
    try {
      await client.authorize()
      console.log('Google Authentication successful.')
      return client
    } catch (error) {
      process.exit(1)
    }
  })();

  sheets = google.sheets({ version: 'v4', auth: client });
}

export { 
  connection,
  sheets
}






