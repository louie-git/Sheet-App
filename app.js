import express from 'express'
import dotenv from 'dotenv';
import mainRouter from './routes/mainRouter.js'
import cors from 'cors'
import authenticateUser from './auth/jwtauth.js';
import { authorizeUser } from './middleware/authMiddleware.js';
dotenv.config();

import { connection } from './config/sheets.js'

const app = express()

app.use(express.json())

var corsOptions = {
  origin: '*',
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

//connection for sheets
connection()

// app.post('/auth/login', authenticateUser)
// app.get('/getUsers', authorizeUser, (req,res)=> res.status(200).send({message: 'Success'}))

// app.use('/api', mainRouter) // Use this instead.
app.use('/', mainRouter)

app.listen(3000, (req, res) => console.log('Server running on port 3000.'))