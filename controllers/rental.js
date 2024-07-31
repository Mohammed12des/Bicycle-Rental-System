const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render("rental/index.ejs", {
      bookings: currentUser.booking,
      imges: {
        Road: "https://i.shgcdn.com/14a36e2c-919f-49ba-b43a-6045bc12313a/-/format/auto/-/preview/3000x3000/-/quality/lighter/",
        Mountain:
          "https://i5.walmartimages.com/seo/Hyper-Bicycle-Men-s-29-Explorer-Mountain-Bike-Hard-Tail-Blue_3e93bdb8-f247-4ae2-898a-e03fe12a5472.c6b499258d504157384035a890ee022e.jpeg",
        Hybrid:
          "https://i5.walmartimages.com/seo/Kent-700C-Men-s-Ridgeland-Hybrid-Bike-Blue-Green_5f0cde30-7309-40f1-a582-1373619c26e0.9a532ae2cc296b2c4a9dcb5cb088d28b.jpeg",
        Touring:
          "https://i0.wp.com/tomsbiketrip.com/wp-content/uploads/2022/02/ridgeback-panorama-2022-touring-bike.jpg?resize=1534%2C1000&ssl=1",
        Gravel:
          "https://www.tradeinn.com/f/14041/140415987/specialized-diverge-sport-700-grx-2024-gravel-bike.jpg",
        Cruiser:
          "https://i5.walmartimages.com/seo/Huffy-26-Cranbrook-Men-s-Cruiser-Bike-with-Perfect-Fit-Frame_c72a2b05-1d15-468d-bb03-c071c4e2e3bd_1.e8e890008d15ba4664ba68cb88018431.jpeg",
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
      imges: {
        Road: "https://i.shgcdn.com/14a36e2c-919f-49ba-b43a-6045bc12313a/-/format/auto/-/preview/3000x3000/-/quality/lighter/",
        Mountain:
          "https://i5.walmartimages.com/seo/Hyper-Bicycle-Men-s-29-Explorer-Mountain-Bike-Hard-Tail-Blue_3e93bdb8-f247-4ae2-898a-e03fe12a5472.c6b499258d504157384035a890ee022e.jpeg",
        Hybrid:
          "https://i5.walmartimages.com/seo/Kent-700C-Men-s-Ridgeland-Hybrid-Bike-Blue-Green_5f0cde30-7309-40f1-a582-1373619c26e0.9a532ae2cc296b2c4a9dcb5cb088d28b.jpeg",
        Touring:
          "https://i0.wp.com/tomsbiketrip.com/wp-content/uploads/2022/02/ridgeback-panorama-2022-touring-bike.jpg?resize=1534%2C1000&ssl=1",
        Gravel:
          "https://www.tradeinn.com/f/14041/140415987/specialized-diverge-sport-700-grx-2024-gravel-bike.jpg",
        Cruiser:
          "https://i5.walmartimages.com/seo/Huffy-26-Cranbrook-Men-s-Cruiser-Bike-with-Perfect-Fit-Frame_c72a2b05-1d15-468d-bb03-c071c4e2e3bd_1.e8e890008d15ba4664ba68cb88018431.jpeg",
      },
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
