

import express from 'express'
import referralResponsesController from '../controllers/ReferralResponsesController.js'
const router = express.Router()

router.get('/', referralResponsesController.getData)



export default router