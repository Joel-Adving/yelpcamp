import express from 'express'
import campgrounds from '../controllers/campgrounds.js'
import { isAuthor, isLoggedIn, validateCampground, catchAsync } from '../middleware.js'
import multer from 'multer'
import { storage } from '../cloudinary/index.js'

const upload = multer({ storage })
const controller = campgrounds()
const router = express.Router()

router
    .route('/')
    .get(catchAsync(controller.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(controller.createCampground))

router.get('/new', isLoggedIn, controller.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(controller.renderEditForm))

router
    .route('/:id')
    .get(catchAsync(controller.renderCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(controller.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(controller.deleteCampground))

export default router
