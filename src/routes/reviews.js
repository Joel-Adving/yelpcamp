import express from 'express'
import { isLoggedIn, validateReview, catchAsync, isReviewAuthor } from '../middleware.js'
import reviews from '../controllers/reviews.js'

const router = express.Router({ mergeParams: true })
const controller = reviews()

router.post('/', validateReview, isLoggedIn, catchAsync(controller.createReview))
router.delete('/:reviewid', isLoggedIn, isReviewAuthor, catchAsync(controller.deleteReview))

export default router
