import express from 'express'
import newHireTrackerController from '../controllers/newHireTrackerController.js';
const router = express.Router()

router.get('/', newHireTrackerController.getData)

export default router