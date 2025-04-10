import { sheets } from '../config/sheets.js'
import dotenv from 'dotenv';
import pagination from '../helpers/pagination.js';
dotenv.config();

const newHireTrackerSheetID = process.env.NEW_HIRE_TRACKER_SHEET_ID
const newHireSheet = process.env.NEW_HIRE_SHEET_NAME
async function getData (req, res){
  const page = req.query.page ? req.query.page : 1
  const limit = req.query.limit ? req.query.limit : 10
  const skip = 2 // 2 is the value used for headers. This depends on the number of rows that is used for headers
  const {from, to} = pagination.paginate(skip,  page, limit )
  try {

    //Get total Data
    const totalSheets = await sheets.spreadsheets.values.get({
      spreadsheetId: newHireTrackerSheetID ,
      range:`${newHireSheet}!A:AW`
    })
    const total_data = totalSheets.data.values
    //Get data based on the limit and page
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: newHireTrackerSheetID,
      range:`${newHireSheet}!A${from}:AW${to}`
    })
    const rows = sheetData.data.values
    res.status(200).send({rows, total_data: total_data.length})
  } catch (error) {
   res.status(500).send({message: 'Internal error', error: error.message}) 
  }
}

export default {
  getData
}