var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user.model');
var nodemailer = require('nodemailer');
var config = require('../../config/main');
var async = require('async');

var passportService = require('../../config/passport');
var passport = require('passport');

/*=====================================
=            Require login            =
=====================================*/

module.exports.requireAuth = passport.authenticate('jwt', { session: false });

/*=============================
=            Login            =
=============================*/

module.exports.login = function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.'});
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	User.findOne({ email }, (err, user) => {
		if (err) { 
			return res.status(500).send(err);
		}
		if (!user) { 
			return res.status(404).send({ error: "User not found." });; 
		}

		user.comparePassword(password, (err, isMatch) => {
			if (err) { 
				return res.status(500).send(err);
			}

			if (!isMatch) {
				return res.status(401).send({ error: 'Incorrect password.' });
			}

			var newUser = {
				email: user.email,
				password: user.password,
				profile: { firstName: user.profile.firstName, lastName: user.profile.lastName }
			}

			var userInfo = setUserInfo(newUser);

			res.status(200).json({
				token: 'JWT ' + generateToken(userInfo),
				user: userInfo
			})
		});
	});
}

/*================================
=            Register            =
================================*/

module.exports.register = function(req,res,next){
	var email = req.body.email;
	var firstName = req.body.profile && req.body.profile.firstName;
	var lastName = req.body.profile && req.body.profile.lastName;
	var password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.'});
	}

	// Return error if full name not provided
	// if (!firstName || !lastName) {
	// 	return res.status(422).send({ error: 'You must enter your full name.'});
	// }

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	User.findOne({email: email}, function(err, user){
		if(err){
			return next(err);
		}
		// If user is not unique, return error
		if (user) {
			return res.status(422).send({ error: 'That email address is already in use.' });
		}

		// If email is unique and password was provided, create account
		var newUser = new User({
			email: email,
			password: password,
			profile: { firstName: firstName, lastName: lastName }
		});

		newUser.save(function(err, newUser){
			if(err){
				return next(err);
			}

			var userInfo = setUserInfo(newUser);

			res.status(201).json({
				token: 'JWT ' + generateToken(userInfo),
				user: userInfo
			})
		})
	})
}

/*=======================================
=            Forgot Password            =
========================================*/

module.exports.forgot = function(req,res,next){
	
	var email = req.body.email;
	
	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.'});
	}

	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ email }, function(err, user) {
				if (err) { 
					return res.status(500).send(err);
				}
				if (!user) { 
					return res.status(404).send({ error: "User not found." });; 
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "gmail",
				host: "smtp.gmail.com",
				auth: {
					user: "fenix6462@gmail.com",
					pass: "@NmPnH1@3"
				},
				tls: {
					rejectUnauthorized: false
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'passwordreset@demo.com',
				subject: 'Node.js Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (err) {
					return res.status(500).send(err);
				}

				console.log('Email sent');
				
				return res.status(200).json({success: true, message: "Email sent"})
			});
		}
	], function(err) {
		if (err){	
			return res.status(500).send(err);
		}
	});
}

/*======================================
=            Reset Password            =
=======================================*/

module.exports.reset = function(req,res,next){
	async.waterfall([
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
				if (err) { 
					return res.status(500).send(err);
				}
				if (!user) { 
					return res.status(404).send({ error: "Password reset token is invalid or has expired." });; 
				}

				user.password = req.body.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;

				user.save(function(err) {
					done(err, user);
				});
			});
		},
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "gmail",
				host: "smtp.gmail.com",
				auth: {
					user: "fenix6462@gmail.com",
					pass: "@NmPnH1@3"
				},
				tls: {
					rejectUnauthorized: false
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'passwordreset@demo.com',
				subject: 'Node.js Password Reset',
				text: 'Hello,\n\n' +
				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (err) {
					return res.status(500).send(err);
				}
				
				console.log('Email sent');
	
				return res.status(200).json({success: true, message: "Email sent"})
			});
		}
	], function(err) {
		if (err){	
			return res.status(500).send(err);
		}
	});
}

/*======================================
=       Authorization Middleware       =
=======================================*/

// Role authorization check
module.exports.roleAuthorization = function(role) {  
	return function(req, res, next) {
	  var user = req.user;
  
	  User.findById(user._id, function(err, foundUser) {
		if (err) {
			res.status(422).json({ error: 'No user was found.' });
			return next(err);
		}
  
		// If user is found, check role.
		if (foundUser.role == role) {
			return next();
		}
  
		res.status(401).json({ error: 'You are not authorized to view this content.' });
		return next('Unauthorized');
	  })
	}
  }

/*======================================
=            Generate token            =
======================================*/

function generateToken(user){
	return jwt.sign(user, config.secret,{
		expiresIn: 10080
	})
}

/*=================================
=            User Info            =
=================================*/

function setUserInfo(request){
	return {
		_id: request._id,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		email: request.email,
		role: request.role,
	}
}