// import express from "express";

// const router = express.Router();

// // controllers
// import { register } from "../controllers/auth";

// router.get("/register", register);

// module.exports = router;
import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
  res.send("register user");
});

module.exports = router;