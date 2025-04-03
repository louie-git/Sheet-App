

import express from 'express'
import newHireBonusTrackerController from '../controllers/newHireBonusTrackerController.js'
const router = express.Router()


router.get('/', newHireBonusTrackerController.getData)
router.post('/', newHireBonusTrackerController.addData)


export default router