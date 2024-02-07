const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please enter a valid email address'),
		// .normalizeEmail(),
		body('password', 'Password has to be valid.')
			.isLength({
				min: 6,
			})
			.isAlphanumeric()
			.trim(),
	],
	authController.postLogin
);

router.post(
	'/signup',
	[
		check('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			// Value ini di dapat dari email pada body { check('email') }
			.custom((value, { req }) => {
				// if (value === 'test@test.com') {
				// 	throw Error('This email adress is forbidden.');
				// }
				// return true;
				return User.findOne({
					email: value,
				}).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-mail already exists, please pick a different one.');
					}
				});
			}),
			// .normalizeEmail(),
		body('password', 'Please enter a password with only numbers and text also at least more than 6 characters.')
			.isLength({
				min: 6,
			})
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Passwords do not match');
				}
				return true;
			}),
	],
	authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
