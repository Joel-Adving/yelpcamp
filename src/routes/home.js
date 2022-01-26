import express from 'express'

import campgrounds from '../controllers/campgrounds.js'
import { catchAsync } from '../middleware.js'

const controller = campgrounds()
const router = express.Router()

router.route('/').get(catchAsync(controller.index))

export default router
