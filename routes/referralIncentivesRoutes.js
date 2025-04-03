
import express from 'express'
import referralIncentivesController from '../controllers/referralIncentivesController.js'
const router = express.Router()


router.get('/', referralIncentivesController.getData)
router.post('/', referralIncentivesController.addData)


export default router