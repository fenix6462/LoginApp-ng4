var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var config = require('../../config/main');

//========================================
// Get Profile
//========================================

module.exports.getProfile = function(req,res,next){
	User.findById( req.user._id, function(err, user){
		console.log(user);
		if (err) { 
			return res.status(500).send(err);
		}
		if (!user) { 
			return res.status(404).send({ error: "User not found." });; 
		}
		res.status(200).json(user);
	})
}

//========================================
// Update Profile
//========================================

module.exports.updateProfile = function(req,res,next){
	User.findById( req.user._id, function(err, user){
		if (err) { 
			return res.status(500).send(err);
		}
		if (!user) { 
			return res.status(404).send({ error: "User not found." });; 
		}
		
		user.email = req.body.email,
		user.profile.firstName = req.body.profile.firstName;
		user.profile.lastName = req.body.profile.lastName;

		user.save(function(saveErr, updatedUser){
			if(err){
				res.status(500).send(saveErr);
			} else {
				res.status(200).json(updatedUser);
			}
		})
	})
}