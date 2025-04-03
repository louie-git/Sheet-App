
import { sheets } from '../config/sheets.js'
import dotenv from 'dotenv';
dotenv.config();
import pagination from '../helpers/pagination.js'



const spreadsheetId = process.env.SPREAD_SHEET_ID;

async function getData (req, res){

  const page = req.query.page ? req.query.page : 1
  const limit = req.query.limit ? req.query.limit : 10
  const skip = 3 // 3 is the value used for headers. This depends on the number of rows that is used for headers
  const {from, to} = pagination.paginate(skip,  page, limit )

  try {
    //Get total Data.
    const totalSheet = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Referral Incentives!A:AQ`
    })

    const total_data = totalSheet.data.values
    //Get data based on limit and page.
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Referral Incentives!A${from}:AQ${to}`
    })
    const rows = sheetData.data.values
    
    res.status(200).send({rows, total_data: total_data.length})
  } catch (error) {
    res.status(500).send({message: 'Internal Error', error : error.message})
  }
}


//not used just for reference
async function addData (req,res) {

  let valueInputOption = 'USER_ENTERED'
  const values = [
    [ "DRC- First Day",	"6027",	"Epe", "Inah Marie", "", "","21782",	"Palacios",	"Gizelle",	"DrCatalyst", "Feb 10, 2025"]
  ]
  try {

    const ReferralIncentivesData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Referral Incentives`
    })
    const ReferralIncentivesDataCount = ( ReferralIncentivesData.data.values).length
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Referral Incentives!A${ReferralIncentivesDataCount + 1}`,
      valueInputOption,
      resource: {
        values
      }
    })
    res.status(200).send({message: 'Data added successfully.'})
  } catch (error) {
    res.status(500).send({MessageEvent: 'Internal error', error: error.message})
  }
}


export default {
  getData,
  addData
}
