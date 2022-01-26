import express from 'express'
import passport from 'passport'
import { catchAsync } from '../middleware.js'
import users from '../controllers/users.js'

const router = express.Router({ mergeParams: true })
const controller = users()

router.route('/register').get(controller.renderRegister).post(catchAsync(controller.registerUser))

router
  .route('/login')
  .get(catchAsync(controller.renderLoginUser))
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    controller.loginUser
  )

router.get('/logout', controller.logoutUser)

export default router
