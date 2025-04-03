

import express from 'express'
import incentivesForFinComController from '../controllers/incentivesForFinComController.js'

const router = express.Router()

router.get('/', incentivesForFinComController.getData)
router.post('/', incentivesForFinComController.addData)

export default router