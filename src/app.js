import './loadEnv.js'
import express from 'express'
import mongoose from 'mongoose'
import { PORT } from './utils/config.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import methodOverride from 'method-override'
// import morgan from 'morgan'
import ejsMate from 'ejs-mate'
import ExpressError from './utils/ExpressError.js'
import campgroundsRoutes from './routes/campgrounds.js'
import homeRoute from './routes/home.js'
import reviewsRoutes from './routes/reviews.js'
import userRoutes from './routes/users.js'
import session from 'express-session'
import flash from 'connect-flash'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from './models/user.js'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import CSP from './utils/csp.js'
import MongoStore from 'connect-mongo'

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/YelpCamp'
await mongoose.connect(dbUrl)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '../public')))
app.use(methodOverride('_method'))
// app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(mongoSanitize())
// app.use(helmet.contentSecurityPolicy(CSP))

const secret = process.env.SECRET || 'verysecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    },
})

store.on('error', function (e) {
    console.log('SESSION STORAGE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800000,
        httpOnly: true,
        // secure: true
    },
}

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.user = req.user
    next()
})

app.use('/', homeRoute)
app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/review', reviewsRoutes)

app.all('/', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    console.log(err)
    const { status = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', { err })
})

app.listen(PORT, () => {
    console.log(`Listening on port${PORT}`)
})
