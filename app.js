import express from 'express'
import dotenv from 'dotenv';
import mainRouter from './routes/mainRouter.js'
import cors from 'cors'
//Not necessary, implemented just incase.
import authenticateUser from './auth/jwtauth.js';
import { authorizeUser } from './middleware/authMiddleware.js';
dotenv.config();

import { connection } from './config/sheets.js'

const app = express()
const PORT = process.env.PORT || 8000
app.use(express.json())


//This is not really important since the application is used only by Rean.
var corsOptions = {
  origin: process.env.CLIENT_URL,
  preflightContinue: false,
  credentials: true,
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))

//connection for sheets
connection()

// app.post('/auth/login', authenticateUser)
// app.get('/getUsers', authorizeUser, (req,res)=> res.status(200).send({message: 'Success'}))

// app.use('/api', mainRouter) // Use this instead.
app.get('/hello', (req,res)=> res.status(200).send({message: 'You are connected.'}))
app.use('/', mainRouter)

app.listen(PORT, (req, res) => console.log(`Server running on port ${PORT}.`))

