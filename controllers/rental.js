const express = require('express')
const router = express.Router()
const User = require('../models/user');

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
      currentUser.booking.push(req.body)
      console.log(req.body)
      currentUser.bike.push(req.body)
      await currentUser.save()
      res.redirect(`/users/${currentUser._id}/rental`)
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  })



  router.get('/:rentalId', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id)
      const rentals = currentUser.rental.id(req.params.applicationId)
      res.render('rental/show.ejs', {
        rentals,
      })
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
  })
  module.exports = router