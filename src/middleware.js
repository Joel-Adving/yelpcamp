import Campground from './models/campground.js'
import ExpressError from './utils/ExpressError.js'
import { campgroundSchema, reviewSchema } from './schemas.js'
import Review from './models/review.js'

export const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first!')
    return res.redirect('/login')
  }
  next()
}

export const validateCampground = function (req, res, next) {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const message = error.details.map(el => el.message).join()
    throw new ExpressError(message, 400)
  }
  if (!error) next()
}

export const validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const message = error.details.map(el => el.message).join()
    throw new ExpressError(message, 400)
  }
  if (!error) next()
}

export const catchAsync = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(err => next(err))
  }
}

export const isAuthor = async function (req, res, next) {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', "You're not authorized to do that")
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

export const isReviewAuthor = async function (req, res, next) {
  const { id, reviewid } = req.params
  const review = await Review.findById(reviewid)
  if (!review.author.equals(req.user._id)) {
    req.flash('error', "You're not authorized to do that")
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

export default catchAsync
