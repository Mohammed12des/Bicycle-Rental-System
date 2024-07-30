const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("rental/index.ejs", {
      bookings: currentUser.booking,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  res.render("rental/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const newBike = {
      company: req.body.company,
      type: req.body.type,
      color: req.body.color,
    };

    const newBooking = {
      adders: req.body.adress,
      fristdate: req.body.sdate,
      lastdate: req.body.edate,
      bike: [newBike],
    };

    currentUser.booking.push(newBooking);

    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/rental`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:bookingId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const booking = currentUser.booking.id(req.params.bookingId);
    res.render("rental/show.ejs", {
      booking,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:bookingId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.booking.id(req.params.bookingId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/rental`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:bookingId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const booking = currentUser.booking.id(req.params.bookingId);
    res.render("rental/edit.ejs", {
      booking,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
router.put("/:bookingId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const booking = currentUser.booking.id(req.params.bookingId);
    booking.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/rental/${req.params.bookingId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
