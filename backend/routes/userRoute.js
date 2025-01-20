const express = require('express');
const { login, logout, register }=require('../controllers/UserController');


const router=express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);


module.exports=router;