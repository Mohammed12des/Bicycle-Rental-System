const express = require('express')
const router = express.Router()
const User = require('../modules/user')

router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id)
      res.render('rental/index.ejs', {
        rental: currentUser.rental,
      })
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  })

  router.get('/new', async (req, res) => {
    res.render('rental/new.ejs')
  })

  router.post('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id)
      req.body.date = new Date(req.body.date)
      currentUser.rental.push(req.body)
      await currentUser.save()
      res.redirect(`/users/${currentUser._id}/rental`)
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  })