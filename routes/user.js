const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const router = Router();

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;

  await User.create({
    username,
    password,
  });

  res.json({
    msg: "User created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.find({
    username,
    password,
  });

  if (user) {
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

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const response = await Course.find({});
  res.json({
    courses: response,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  //   we know that middleware have 3 works.Those are
  //   1.end the request
  //   2.forward the request
  //   3.pass data along to the next middleware
  //   In this endpoint we need username to purchase the course into that particular user.But here the user only sending the authorization token.But int userMiddleware when we decoding the token we can find the username.so we have to send the username form userMiddleware to this userMiddleware along with.
  const username = req.username;
  const courseId = req.params.courseId;

  await User.updateOne(
    { username },
    {
      $push: {
        purchsedCourses: courseId,
      },
    }
  );
  res.json({
    msg: "Course purchased successfully",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.username,
  });

  const courses = await Course.find({
    _id: {
      $in: user.purchsedCourses,
    },
  });

  res.json({
    courses,
  });
});

module.exports = router;
