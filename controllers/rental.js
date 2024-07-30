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
      adders: req.body.adders,
      fristdate: req.body.sdate,
      lastdate: req.body.edate,
      bike: [newBike],
    };
    const currentDate = new Date();

    if (req.body.sdate < currentDate.toISOString().split("T")[0]) {
      return res.send("Start date cannot be before today.");
    }
    if (req.body.edate < req.body.sdate) {
      return res.send("End date cannot be before the start date.");
    }

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
    let targetEmail = undefined;
    const users = await User.find();
    users.forEach((user) => {
      let bookings = user.booking;
      bookings.forEach((booking) => {
        if (String(booking._id) === req.params.bookingId) {
          targetEmail = user.email;
        }
      });
    });

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
    console.log(booking);
    res.render("rental/edit.ejs", {
      booking,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
// // router.put("/:bookingId", async (req, res) => {
// //   try {
// //     const currentUser = await User.findById(req.session.user._id);
// //     const booking = currentUser.booking.id(req.params.bookingId);

// //     booking.set(req.body);
// //     await currentUser.save();
// //     res.redirect(`/users/${currentUser._id}/rental/${req.params.bookingId}`);
// //   } catch (error) {
// //     console.log(error);
// //     res.redirect("/");
// //   }
// });

router.post("/:bookingId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const booking = currentUser.booking.id(req.params.bookingId);

    const newBike = {
      company: req.body.company,
      type: req.body.type,
      color: req.body.color,
    };

    const newBooking = {
      adders: req.body.adders,
      fristdate: req.body.sdate,
      lastdate: req.body.edate,
      bike: [newBike],
    };
    const currentDate = new Date();

    if (req.body.sdate < currentDate.toISOString().split("T")[0]) {
      return res.send("Start date cannot be before today.");
    }
    if (req.body.edate < req.body.sdate) {
      return res.send("End date cannot be before the start date.");
    }
    console.log(req.body);
    // currentUser.booking.push(newBooking);
    booking = newBooking;
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/rental/${req.params.bookingId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
