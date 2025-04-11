
import { sheets } from '../config/sheets.js'
import dotenv from 'dotenv';
import pagination from '../helpers/pagination.js';

dotenv.config();

const spreadsheetId = process.env.SPREAD_SHEET_ID;
const incentivesForFincomSheet = process.env.INCENTIVES_FOR_FINCOM_SHEET_NAME

async function getData (req, res){
  try {
    
    const page = req.query.page ? req.query.page : 1
    const limit = req.query.limit ? req.query.limit : 10
    const skip = 2 // 2 is the value used for headers. This depends on the number of rows that is used for headers
    const {from, to} = pagination.paginate(skip,  page, limit )

    const totalSheets = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:incentivesForFincomSheet
    })

    const total_data = (totalSheets.data.values).length

    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      // range: `Copy of Incentives for FinCom!A${from}:U${to}`
      range: `${incentivesForFincomSheet}!A${from}:U${to}`
    })
  
    const rows = sheetData.data.values
    res.status(200).send({rows, total_data})
  } catch (error) {
    res.status(500).send({message: 'Internal error', error: error.message})
  }
}

async function addData (req,res) {

  //Check if there are users
  if(!req.body.users) return res.status(400).send({message: 'No users'})
  //Check if required fields exists
  const verified = req.body.users.every(data => data.amount >= 1000 && data.amount <= 10000 && data.effective_date && data.remarks)
  if(!verified) return res.status(400).send({message: 'Some data are required.'})

  let valueInputOption = 'USER_ENTERED'

  //Format data for saving
  const values = req.body.users.reduce((acc,cur) => {
    acc.push([
      '',
      cur.employee_id,
      cur.last_name,
      cur.first_name,
      cur.department,
      'Add',
      cur.allowance_type,
      cur.type,
      cur.amount,
      cur.effective_date,
      cur.pay_date,
      cur.remarks,
      cur.new_hire_id || '',
      cur.new_hire_last_name || '',
      cur.new_hire_first_name || '',
      `${cur.new_hire_first_name || ''} ${cur.new_hire_last_name || ''}`

    ])

    return acc
  },[])

  try {

    //Get the lenght of data
    const sheetsData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:incentivesForFincomSheet
    })
    const rows = ( sheetsData.data.values).length

    //Add data to the last.
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${incentivesForFincomSheet}!A${rows + 1}`,
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
  addData,
}
