const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("rental/index.ejs", {
      bookings: currentUser.booking,
      imges: {
        Track: "https://gearjunkie.com/legacy/images/9531.jpg",
        Trinx:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSisJllnhY55iy6blLnDC3iMxQ7XCQBkqwNIA&s",
        klyes:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT366qhoEO_hVdQhYAvU86RMGUwbKf13t-c_Q&s",
      },
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  res.render("rental/new.ejs", { startDateError: false, endDateError: false });
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
    const date = req.body.sdate;
    if (req.body.sdate < currentDate.toISOString().split("T")[0]) {
      return res.render("rental/new.ejs", {
        startDateError: true,
        endDateError: false,
      });
    }
    if (req.body.edate < req.body.sdate) {
      return res.render("rental/new.ejs", {
        startDateError: false,
        endDateError: true,
      });
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

router.put("/:bookingId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    const booking = currentUser.booking.id(req.params.bookingId);

    const sdate = new Date(req.body.sdate);
    const edate = new Date(req.body.edate);
    const currentDate = new Date();

    if (sdate < currentDate) {
      return res.send("Start date cannot be before today.");
    }
    if (edate < sdate) {
      return res.send("End date cannot be before the start date.");
    }

    const newBike = {
      company: req.body.company,
      type: req.body.type,
      color: req.body.color,
    };

    booking.adders = req.body.adders;
    booking.fristdate = req.body.sdate;
    booking.lastdate = req.body.edate;
    booking.bike[0] = newBike;

    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/rental/${req.params.bookingId}`);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.redirect("/error");
  }
});

module.exports = router;
