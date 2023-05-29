// TODO: problem with the express-jwt version

const { expressjwt: expressJwt } = require("express-jwt");
// import User from "../models/user";
// import Course from '../models/course'
 
export const requireSignin = expressJwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});