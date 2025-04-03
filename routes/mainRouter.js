

import express from 'express'
import newHireBonusTrackerRoutes from './newHireBonusTrackerRoutes.js';
import referralIncentivesRoutes from './referralIncentivesRoutes.js';
import incentivesForFinComRoutes from './incentivesForFinComRoutes.js';
import referralResponsesRoutes from './referralResponsesRoutes.js';
import newHireTrackerRoutes from './newHireTrackerRoutes.js';

const router = express.Router()

router.use('/NHBT', newHireBonusTrackerRoutes)
router.use('/RI', referralIncentivesRoutes)
router.use('/IFFC', incentivesForFinComRoutes)
router.use('/RR', referralResponsesRoutes)
router.use('/NHT', newHireTrackerRoutes)
router.use((req,res) => res.status(404).send({message: 'Page not found.'}))
export default router
