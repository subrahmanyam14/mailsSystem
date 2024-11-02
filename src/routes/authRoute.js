const {register, checkEmail, login, addAppPasword} = require("../controller/authController.js");

const express = require("express");

const route = express.Router();

route.post("/register", register);

route.post("/login", login);

route.post("/check", checkEmail);

route.put("/appPassword/:mail", addAppPasword);

module.exports = route;
