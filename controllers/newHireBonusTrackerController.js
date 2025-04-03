
import { sheets } from '../config/sheets.js'
import dotenv from 'dotenv';
import pagination from '../helpers/pagination.js';
dotenv.config();

const spreadsheetId = process.env.SPREAD_SHEET_ID;

async function getData (req, res){

  const page = req.query.page ? req.query.page : 1
  const limit = req.query.limit ? req.query.limit : 10
  const skip = 3 // 2 is the value used for headers. This depends on the number of rows that is used for headers
  const {from, to} = pagination.paginate(skip,  page, limit )
  try {

    //Get total data
    const totalSheets = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Copy of New Hire Bonus Tracker!A:Z`
    })

    const total_data = totalSheets.data.values

    //.Get total data based on the limit and page.
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Copy of New Hire Bonus Tracker!A${from}:Z${to}`
    })

    const rows = sheetData.data.values

    res.status(200).send({rows, total_data: total_data.length})
  } catch (error) {
   res.status(500).send({message: 'Internal error', error: error.message}) 
  }
}



async function addData (req,res) {

  try {
    if(!req.body.users) return res.status(400).send({message: 'New hire/s info required.'})
    const dates = req.body.users.map(user => user.start_date)
  
    req.body.users.forEach(user => {
      if(!user.nhb_type) return res.status(400).send({message: 'NHB type is required'})
    })
  
    dates.forEach( date => {
      const dateFormat = new Date(date)
      if(dateFormat.getDay() !== 1) return res.status(400).send({message: 'Only "Monday" is Allowed'})
    })


    //check if users has empty date.
    const hasEmptyDate = req.body.users.reduce((acc, cur) => {
      if(!cur.start_date) acc.push(true) 
      return acc
    },[])

    if(hasEmptyDate.includes(true)) return res.status(400).send({message: 'Start date required'})



    const referrals = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range:`Copy of 2025 Referral Responses!A:T`
    })

    let rows = referrals.data.values
    //Reverse the array to loop through in ascending manner. Starting from latest data.
    rows = rows.toReversed()

    const referrersInfo = []

    const values = req.body.users.reduce((acc, cur)=> {
      const selectedDate = new Date(cur.start_date)
      const firstMonthDateValue = selectedDate.setMonth(selectedDate.getMonth() + 1)
      const thirdMonthDateValue = selectedDate.setMonth(selectedDate.getMonth() + 3)
      const sixwtMonthDateValue = selectedDate.setMonth(selectedDate.getMonth() + 6)

      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      const firstMonth = formatDate(new Date(firstMonthDateValue))
      const thirdMonth = formatDate(new Date(thirdMonthDateValue))
      const sixthMonth = formatDate(new Date(sixwtMonthDateValue))

      function checkPayDate(date) {
        const day = String(date.getDate()).padStart(2, '0');

        if(day > 25) {
          const payDate = new Date(date)
          payDate.setMonth(payDate.getMonth() + 1)
          return formatDate(payDate)
        }
        else {
          return formatDate(new Date(date))
        }
      }

      const val = [
        cur.status,
        '',
        cur.employee_id,
        cur.last_name,
        cur.first_name,
        cur.LOB,
        cur.start_date,
        cur.designation,
        cur.nhb_type,
        '',
        '',
        firstMonth,
        cur.nhb_type  === 'NonDRC NHB' ? 2000 : 1000,
        checkPayDate(new Date(firstMonthDateValue)),
        '',
        '',
        '',
        '',
        thirdMonth,
        cur.nhb_type  === 'NonDRC NHB' ? 3000 : 2000,
        checkPayDate(new Date(thirdMonthDateValue)),
        sixthMonth,
        cur.nhb_type  === 'NonDRC NHB' ? '' : 2000,
        checkPayDate(new Date(sixwtMonthDateValue))
      ]
      acc.push(val)

      function amountFormat(value, type) {
        switch (value) {
          case 'Meditab':
            if(type === 1) return 2000 
            if(type === 3) return 3000
            return 3000
          case 'ErTech':
            if(type === 1) return 3000 
            if(type === 3) return 5000
            return 10000
          case 'DrCatalyst': // DrCatalyst not included on training pay
            if (type === 5) return 2000
            return ''
          default:
            if(type === 1) return 1000
            if(type === 3) return 2000
            return 2000

        }
      }

      for(let row of rows){
        let exists = false    
        for(let value of row){ //this can be changes to row.includes
          if(value == 'renielyntubig0916@gmail.com') { //to do: change to new Hire email
            exists = true
            referrersInfo.push([
              cur.status, //Always DRC- First Day.
              row[1],
              row[2],
              row[3],
              '',
              '',
              cur.employee_id,
              cur.last_name,
              cur.first_name,
              cur.LOB,
              cur.start_date,
              cur.designation,
              '',
              '',
              '',
              cur.start_date, // attended first day
              ['DrCatalyst', 'Meditab', 'ErTech'].includes(cur.LOB) ? 2000 : 1000, // amount
              checkPayDate(new Date(cur.start_date)), //pay day
              '', 
              '', //date for live with client  //Manually assigned
              cur.LOB === 'DrCatalyst' ? 2000 : '',
              '', // Pay day 
              '',
              '', // Training Eval Date // Manually assigned
              '', // Training Status 
              amountFormat(cur.LOB, 1), // Amount
              '', // Payday
              '',
              thirdMonth, // 3rd month date
              '', // employment status
              amountFormat(cur.LOB, 3), // amount
              checkPayDate(new Date(thirdMonth)), // pay
              '',
              sixthMonth, // regularization month date
              '', // employment status
              amountFormat(cur.LOB, 5), // amount
              checkPayDate(new Date(sixthMonth)), // pay
            ])
          }
        }
        if(exists) break;
      }
      return acc
    }, [])

    //Adding Data to New Hire Bonus Tracker.
    //Get The lenght of rows in New Hire Bonus Tracker
    const newHireBonusTrackerRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Copy of New Hire Bonus Tracker'
    })

    const newHireBonusTrackerCount = (newHireBonusTrackerRows.data.values).length

    //To Add values
    let valueInputOption = 'USER_ENTERED'
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Copy of New Hire Bonus Tracker!A${newHireBonusTrackerCount + 1}`,
      valueInputOption,
      resource: {
        values:values
      }
    })
    // Seprates the code for adding Referrers info.
    await addReferrerInfoToReferrerIncentives(referrersInfo)
    res.status(200).send({message: 'Data added successfully.'})
  } catch (error) {
    res.status(500).send({message: 'Internal error', error: error.message})
  }
}

async function addReferrerInfoToReferrerIncentives (data) {
  try {

    //Adding referrer's infor to Referral Incentives
    //Get the total length of rows in Referral Incentives
    const valueInputOption = 'USER_ENTERED'
    const referralIncentivesRows = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Referral Incentives'
    })
    const referralIncentivesCount = (referralIncentivesRows.data.values).length
    //Add values to Referral Incentives    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Referral Incentives!A${referralIncentivesCount + 1}`,
      valueInputOption,
      resource: {
        values:data
      }
    })
    return
  } catch (error) {
     throw error
  }
}

export default {
  getData,
  addData
}