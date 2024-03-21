const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const router = Router();

router.post("/signup", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  await Admin.create({
    username,
    password,
  });

  res.json({
    message: "Admin created successfully",
  });
});

router.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  //validate
  const admin = Admin.find({
    username,
    password,
  });

  if (admin) {
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({
      token,
    });
  } else {
    res.status(411).json({
      msg: "Incorrect email and pass",
    });
  }
});

router.post("/courses", adminMiddleware, async function (req, res) {
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });

  res.json({
    msg: "Course created successfully",
    coursesId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, async function (req, res) {
  const response = await Course.find({});
  res.json({
    courses: response,
  });
});

module.exports = router;
