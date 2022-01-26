import User from '../models/user.js'

const users = () => {
  /////////////////
  const renderRegister = (req, res) => {
    res.render('users/register')
  }

  const registerUser = async (req, res) => {
    try {
      const { email, username, password } = req.body
      const user = await new User({ email, username })
      const registeredUser = await User.register(user, password)
      req.login(registeredUser, err => {
        if (err) return next(err)
        req.flash('success', 'Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
      })
    } catch (err) {
      req.flash('error', err.message)
      res.redirect('/register')
    }
  }

  const renderLoginUser = async (req, res) => {
    res.render('users/login')
  }

  const loginUser = async (req, res) => {
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
  }

  const logoutUser = async (req, res) => {
    req.logOut()
    req.flash('success', 'Goodbye!')
    res.redirect('/')
  }

  return {
    renderRegister,
    logoutUser,
    loginUser,
    renderLoginUser,
    registerUser,
  }
}

export default users
