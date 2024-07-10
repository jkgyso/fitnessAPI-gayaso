const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

module.exports.registerUser = (req, res) => {

	let newUser = new User({
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10)
	})

	if (!req.body.email.includes("@")){
	    return res.status(400).send({ error: 'Email invalid' });
	} else if (req.body.password.length < 8) {
	    return res.status(400).send({ error: 'Password must be atleast 8 characters' });
	} else {

		return newUser.save().then(user => res.status(201).send({ message: 'Registered Successfully'})).catch(saveErr => {

			console.error('Error in saving the user: ', saveErr);

			return res.status(500).send({ error: 'Error in Save' });
		})
	}
};

module.exports.loginUser = (req, res) => {

	if(req.body.email.includes('@')) {
		
		return User.findOne({ email: req.body.email }).then(user => {

			if(user == null) {

				return res.status(401).send({ error: 'No Email Found'});

			} else {

				const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

				if(isPasswordCorrect) {

					return res.status(200).send({ access: auth.createAccessToken(user)})

				} else {

					return res.status(401).send({ error: 'Email and password do not match'});
				}
			}
		}).catch(findErr => {

			console.error('Error in finding the user: ', findErr);

			return res.status(500).send({ error: 'Error in find' });
		})

	} else {

		return res.status(400).send({ error: 'Invalid in email'});
	}
};

module.exports.userDetails = (req, res) => {

	return User.findById(req.user.id).then(user => {

		if(!user) {
			return res.status(404).send('User not found');
		}
		user.password = "";
		return res.status(200).send({ user });

	}).catch(findErr => {

		console.error('Error in finding the user: ', findErr);	

		return res.status(500).send({error: 'Failed to fetch user profile'});
	})
};

