
import { sheets } from '../config/sheets.js'
import dotenv from 'dotenv';
dotenv.config();
import pagination from '../helpers/pagination.js'


const spreadsheetId = process.env.SPREAD_SHEET_ID;

async function getData (req, res){
  const page = req.query.page ? req.query.page : 1
  const limit = req.query.limit ? req.query.limit : 10
  const skip = 2 // 2 is the value used for headers. This depends on the number of rows that is used for headers
  const {from, to} = pagination.paginate(skip,  page, limit )

  try {
    const totalSheets = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Copy of 2025 Referral Responses!A:T`
    })

    const total_data = totalSheets.data.values
    
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Copy of 2025 Referral Responses!A${from}:T${to}`
    })
    const rows = sheetData.data.values
    
    res.status(200).send({rows, total_data: total_data.length})
  } catch (error) {
    res.status(500).send({message: 'Internal Error', error : error.message})
  }
}



export default {
  getData,
}